import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button, PaginationContainer, PageInfo } from "./styled";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <PaginationContainer>
      <Button onClick={handlePrevious} disabled={currentPage === 1}>
        <FiChevronLeft size={24} />
      </Button>
      <PageInfo>
        Página {currentPage} de {totalPages || 1}
      </PageInfo>
      <Button onClick={handleNext} disabled={currentPage === totalPages}>
        <FiChevronRight size={24} />
      </Button>
    </PaginationContainer>
  );
};

export default Pagination;
