import { apiUrl } from '../support/utils/login';
import { PRODUCT_LISTING } from './data-configuration';

export const resultsTitleSelector = 'cx-breadcrumb h1';
export const productItemSelector = 'cx-product-list cx-product-list-item';
export const productNameSelector = 'cx-product-list-item .cx-product-name';
export const firstProductItemSelector = `${productItemSelector}:first`;
export const pageLinkSelector = 'cx-pagination a.current';
export const sortingOptionSelector = 'cx-sorting .ng-select:first';
export const firstProductPriceSelector = `${firstProductItemSelector} .cx-product-price`;
export const firstProductNameSelector = `${firstProductItemSelector} a.cx-product-name`;
export const searchUrlPrefix = `${apiUrl}/rest/v2/electronics-spa/products/search`;

export const QUERY_ALIAS = {
  FIRST_PAGE: 'first_page_query',
  CATEGORY_PAGE: 'category_page_query',
  BRAND_PAGE: 'brand_page_query',
  SONY_CLEAR_FACET: 'sony_query_clear_facet',
  PRICE_ASC_FILTER: 'price_query_asc_filter',
  PRICE_DSC_FILTER: 'price_query_dsc_filter',
  NAME_DSC_FILTER: 'name_query_dsc_filter',
  CATEGORY_FILTER: 'category_query_filter',
  STORE_FILTER: 'store_query_filter',
  COLOR_FILTER: 'color_query_filter',
  TOP_RATED_FILTER: 'topRated_query_filter',
  SONY: 'sony_query',
  DSC_N1: 'dsc_n1_query',
  CANON: 'canon_query',
  CAMERA: 'camera_query',
  FACET: 'facet_query',
  PRODUCE_CODE: 'productCode_query',
  INFINITE_SCROLL_PRODUCT_LOADED: 'productLoaded_query',
};

export function clickSearchIcon() {
  cy.get('cx-searchbox cx-icon[aria-label="search"]').click({ force: true });
}

export function assertFirstProduct() {
  cy.get(productNameSelector).first().invoke('text').should('match', /\w+/);
}

export function checkDistinctProductName(firstProduct: string) {
  cy.get(productNameSelector)
    .first()
    .invoke('text')
    .should('match', /\w+/)
    .should('not.be.eq', firstProduct);
}

export function verifyProductSearch(
  productAlias: string,
  sortingAlias: string,
  sortBy: string
): void {
  cy.get(productNameSelector)
    .first()
    .invoke('text')
    .should('match', /\w+/)
    .then((firstProduct) => {
      // Navigate to next page
      nextPage();
      cy.get(pageLinkSelector).should('contain', '2');

      cy.wait(`@${productAlias}`);

      checkDistinctProductName(firstProduct);

      cy.get('cx-sorting .ng-select:first').ngSelect(sortBy);

      cy.wait(`@${sortingAlias}`);

      cy.get(pageLinkSelector).should('contain', '2');

      checkDistinctProductName(firstProduct);
    });
}

export function searchResult() {
  cy.server();
  createCameraQuery(QUERY_ALIAS.CAMERA);
  cy.wait(`@${QUERY_ALIAS.CAMERA}`).then((xhr) => {
    const cameraResults = xhr.response.body.pagination.totalResults;

    cy.get(resultsTitleSelector).should(
      'contain',
      `${cameraResults} results for "camera"`
    );
    cy.get(productItemSelector).should(
      'have.length',
      PRODUCT_LISTING.PRODUCTS_PER_PAGE
    );
    cy.get(firstProductItemSelector).within(() => {
      cy.get('a.cx-product-name').should('be.visible');
    });
  });
}

export function nextPage(): void {
  cy.get(pageLinkSelector).next().first().click();
}

export function choosePage(pageNumber: number): void {
  cy.get('cx-pagination').contains(pageNumber).first().click();
}

export function previousPage(): void {
  cy.get(pageLinkSelector).prev().first().click();
}

export function verifyNextPage(pageNumber: number): void {
  nextPage();
  cy.get(pageLinkSelector).should('contain', pageNumber);
}

export function verifyChoosePage(pageNumber: number): void {
  choosePage(pageNumber);
  cy.get(pageLinkSelector).should('contain', pageNumber);
}

export function verifyPreviousPage(pageNumber: number): void {
  previousPage();
  cy.get(pageLinkSelector).should('contain', pageNumber);
}

export function viewMode() {
  cy.get('cx-product-view button:first').click({ force: true });
  cy.get('cx-product-list cx-product-grid-item').should(
    'have.length',
    PRODUCT_LISTING.PRODUCTS_PER_PAGE
  );
}

export function filterUsingFacetFiltering() {
  cy.server();
  createFacetFilterQuery(QUERY_ALIAS.FACET);

  clickFacet('Stores');

  cy.wait(`@${QUERY_ALIAS.FACET}`).then((xhr) => {
    const facetResults = xhr.response.body.pagination.totalResults;
    cy.get(resultsTitleSelector).should(
      'contain',
      `${facetResults} results for "camera"`
    );
  });
}

export function clearActiveFacet(mobile?: string) {
  cy.get('cx-active-facets a:first').click();
  cy.get(resultsTitleSelector).should('contain', 'results for "camera"');
}

export function sortByLowestPrice() {
  createProductSortQuery('price-asc', 'query_price_asc');
  cy.get(sortingOptionSelector).ngSelect('Price (lowest first)');
  cy.wait('@query_price_asc').its('status').should('eq', 200);
  cy.get(firstProductPriceSelector).should('contain', '$1.58');
}

export function sortByHighestPrice() {
  createProductSortQuery('price-desc', 'query_price_desc');
  cy.get(sortingOptionSelector).ngSelect('Price (highest first)');
  cy.wait('@query_price_desc').its('status').should('eq', 200);
  cy.get(firstProductPriceSelector).should('contain', '$6,030.71');
}

export function sortByNameAscending() {
  createProductSortQuery('name-asc', 'query_name_asc');
  cy.get(sortingOptionSelector).ngSelect('Name (ascending)');
  cy.wait('@query_name_asc').its('status').should('eq', 200);
  cy.get(firstProductNameSelector).should('contain', '10.2 Megapixel D-SLR');
}

export function sortByNameDescending() {
  createProductSortQuery('name-desc', 'query_name_desc');
  cy.get(sortingOptionSelector).ngSelect('Name (descending)');
  cy.wait('@query_name_desc').its('status').should('eq', 200);
  cy.get(firstProductNameSelector).should('contain', 'Wide Strap for EOS 450D');
}

export function sortByRelevance() {
  createProductSortQuery('relevance', 'query_relevance');
  cy.get(sortingOptionSelector).ngSelect('Relevance');
  cy.wait('@query_relevance').its('status').should('eq', 200);
  cy.get(firstProductNameSelector).should('not.be.empty');
}

export function sortByTopRated() {
  cy.get(sortingOptionSelector).ngSelect('Top Rated');
  cy.get(firstProductNameSelector).should('not.be.empty');
}

export function checkFirstItem(productName: string): void {
  cy.get('cx-product-list-item .cx-product-name')
    .first()
    .then((firstProductName) => {
      const clearHTMLProductName = productName.replace(/<(.|\n)*?>/g, '');
      cy.wrap(firstProductName).should('contain', clearHTMLProductName);
    });
}

export function clickFacet(header: string) {
  cy.get('cx-facet .heading')
    .contains(header)
    .parents('cx-facet')
    .within(() => {
      cy.get('a.value').first().click();
    });
}

export function clearSelectedFacet(mobile: string) {
  if (mobile) {
    cy.get(
      `cx-product-facet-navigation ${mobile} .cx-facet-filter-pill .close:first`
    ).click({ force: true });
  } else {
    cy.get(
      'cx-product-facet-navigation .cx-facet-filter-container .cx-facet-filter-pill .close:first'
    ).click({ force: true });
  }
}

function createCameraQuery(alias: string): void {
  cy.route('GET', `${searchUrlPrefix}?fields=*&query=camera*`).as(alias);
}

function createFacetFilterQuery(alias: string): void {
  cy.route(
    'GET',
    `${searchUrlPrefix}?fields=*&query=camera:relevance:availableInStores*`
  ).as(alias);
}

export function createProductSortQuery(sort: string, alias: string): void {
  cy.route('GET', `${searchUrlPrefix}?fields=*&sort=${sort}*`).as(alias);
}

export function createAllProductQuery(alias: string): void {
  cy.route('GET', `${searchUrlPrefix}*`).as(alias);
}

export function createProductQuery(
  alias: string,
  queryId: string,
  pageSize: number,
  currentPage: string = ''
): void {
  cy.route(
    'GET',
    `${searchUrlPrefix}?fields=*&query=${queryId}&pageSize=${pageSize}${currentPage}&lang=en&curr=USD`
  ).as(alias);
}

export function createProductFacetQuery(
  param: string,
  search: string,
  alias: string
): void {
  cy.route(
    'GET',
    `${searchUrlPrefix}?fields=*&query=${search}:relevance:${param}*`
  ).as(alias);
}

export function assertNumberOfProducts(alias: string, category: string) {
  cy.get(alias).then((xhr) => {
    const body = xhr.response.body;
    const paginationTotalresults: number = body.pagination.totalResults;
    const productLengthInPage: number = body.products.length;
    const firstProduct = body.products[0].name;

    cy.get('cx-breadcrumb h1').should(
      'contain',
      `${paginationTotalresults} results for ${category}`
    );

    cy.get(productItemSelector).should('have.length', productLengthInPage);

    checkFirstItem(firstProduct);
  });
}
