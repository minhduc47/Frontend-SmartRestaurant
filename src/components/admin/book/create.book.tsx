// This component is legacy (Book Store). Dish management is handled by create.dish.tsx.

interface IProps {
    isOpenCreate: boolean;
    setIsOpenCreate: (isOpen: boolean) => void;
    refreshTable: () => void;
}

const CreateBook = (props: IProps) => {
    void props; // legacy stub – book management migrated to create.dish.tsx
    return null;
}

export default CreateBook;