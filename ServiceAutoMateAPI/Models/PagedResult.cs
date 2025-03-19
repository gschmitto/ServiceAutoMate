namespace ServiceAutoMateAPI.Models
{
    public class PagedResult<T>(IEnumerable<T> items, long totalCount, int currentPage, int pageSize)
    {
        public IEnumerable<T> Items { get; set; } = items;
        public long TotalCount { get; set; } = totalCount;
        public int TotalPages { get; set; } = (int)Math.Ceiling(totalCount / (double)pageSize);
        public int CurrentPage { get; set; } = currentPage;
        public int PageSize { get; set; } = pageSize;
    }
}