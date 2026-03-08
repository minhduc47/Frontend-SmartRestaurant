
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { App, Table, Upload } from 'antd';
import { Modal } from 'antd';
import { useState } from 'react';
import Exceljs from 'exceljs';
import { Buffer } from 'buffer';
import { createListUsersAPI } from '@/services/api';
import templateFile from '@/assets/template/user.xlsx?url';
interface IProps {
    isOpenModalImport: boolean;
    setIsOpenModalImport: (isOpen: boolean) => void;
    refreshTable: () => void;
}

const { Dragger } = Upload;


const ImportUser = (props: IProps) => {
    const { isOpenModalImport, setIsOpenModalImport, refreshTable } = props;

    const { message, notification } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;
                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        let keys = firstRow.values as any;
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any;
                            let obj = {} as any;
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })

                    });
                    jsonData = jsonData.map((item, index) => {
                        return {
                            ...item,
                            id: index + 1, // Add an id for each item
                        };
                    });
                    setDataImport(jsonData);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        customRequest({ file: _file, onSuccess }) {
            // Simulate a file upload
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000);
        },
        accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
    };
    const handleImportData = async () => {
        setIsSubmit(true);
        const dataImportWithPassword = dataImport.map((item) => {
            return {
                fullName: item.fullName,
                email: item.email,
                phone: item.phone,
                password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
            }
        })
        const res = await createListUsersAPI(dataImportWithPassword);
        if (res.data) {
            notification.success({
                message: 'Bulk Create Users',
                description: (<>
                    <div>success= {res.data.countSuccess}; error= {res.data.countError}</div>
                </>),
            });
        }
        setIsSubmit(false);
        setIsOpenModalImport(false);
        setDataImport([]); // Clear data after successful import
        refreshTable();

    }
    return (
        <Modal
            title="Upload File"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isOpenModalImport}
            onOk={() => handleImportData()}
            onCancel={() => {
                setIsOpenModalImport(false);
                setDataImport([]); // Clear data on modal close
            }}
            okText="Import Data"
            okButtonProps={{
                disabled: dataImport.length > 0 ? false : true,
                loading: isSubmit,
            }}
            maskClosable={false}
            destroyOnClose={true}
        >
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                    &nbsp; <a
                        onClick={e => e.stopPropagation()}
                        href={templateFile} download>
                        Download Sample File
                    </a>
                </p>
            </Dragger>
            <div style={{ paddingTop: 20 }}>
                <Table
                    rowKey={"id"}
                    title={() => <span>Preview Data</span>}
                    dataSource={dataImport}
                    columns={[
                        {
                            title: 'Full Name',
                            dataIndex: 'fullName',
                        },
                        {
                            title: 'Email',
                            dataIndex: 'email',
                        },
                        {
                            title: 'Phone',
                            dataIndex: 'phone'
                        },
                    ]}
                />
            </div>
        </Modal>

    );
};

export default ImportUser;