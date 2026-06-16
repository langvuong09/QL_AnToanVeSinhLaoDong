type PaginationProps = {
    totalCount: number;

    pageSize: number;
    setPageSize: (v: number) => void;

    currentPage: number;
    setCurrentPage: (v: number) => void;

    onChangePageSize?: (pageSize: number) => void;
    onChangeCurrentPage?: (page: number) => void;
}

const Pagination = ({
    totalCount,
    pageSize, setPageSize,
    currentPage, setCurrentPage,
    onChangePageSize, onChangeCurrentPage,
}: PaginationProps) => {
    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageSize = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1);
        onChangePageSize?.(newSize);
        onChangeCurrentPage?.(1);
    };

    const handlePrev = () => {
        const prev = Math.max(1, currentPage - 1);
        setCurrentPage(prev);
        onChangeCurrentPage?.(prev);
    };

    const handleNext = () => {
        const next = Math.min(totalPages, currentPage + 1);
        setCurrentPage(next);
        onChangeCurrentPage?.(next);
    };

    const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const rangeEnd = Math.min(currentPage * pageSize, totalCount);

    return (
        <div className="shrink-0 flex items-center justify-end gap-4 px-5 py-3 border-t border-gray-200 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
                <select
                    value={pageSize}
                    onChange={(e) => handlePageSize(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm outline-none cursor-pointer bg-white hover:border-gray-400 transition-colors"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
            <span className="text-gray-500 tabular-nums">
                {totalCount === 0 ? '0' : `${rangeStart} - ${rangeEnd}`} of {totalCount}
            </span>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={handlePrev}
                    className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <i className="fa-solid fa-chevron-left text-xs" />
                </button>
                <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={handleNext}
                    className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <i className="fa-solid fa-chevron-right text-xs" />
                </button>
            </div>
        </div>
    );
}

export default Pagination;