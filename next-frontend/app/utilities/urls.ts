export const generatePageMeta = (url, page, totalCount, totalPage, limit) => {
    const perviousPage = new URL(url);
    perviousPage.searchParams.set('page', `${page - 1}`)

    const nextPage = new URL(url)
    nextPage.searchParams.set('page', `${page + 1}`)

    const metadata: IMetaData = {
        total_count: totalCount,
        total_page: totalPage,
        limit: limit,
        page,
        next_page: page < totalPage ? nextPage.pathname + nextPage.search : null,
        prev_page: page > 1 ? perviousPage.pathname + perviousPage.search : null
    }

    return metadata;
}