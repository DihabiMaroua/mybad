// hal.js
/**
 * Helper functions for the HAL specification.
 * See HAL specification: https://stateless.group/hal_specification.html
 */

/**
 * Returns a Link Object.
 * @param {*} href 
 * @param {*} rel 
 * @param {*} type 
 * @param {*} title 
 * @returns 
 */
function halLinkObject(href, rel = '', type = 'application/json', title = '') {
    let obj = {
        "href": href,
        "type": type
    };
    if (rel) obj["rel"] = rel;
    if (title) obj["title"] = title;
    return obj;
}

/**
 * Creates a standardized HAL response with embedded links.
 * @param {*} data 
 * @param {*} links 
 * @returns 
 */
function createHalResponse(data, links) {
    let response = {
        "_links": links,
        ...data
    };
    return response;
}

module.exports = { halLinkObject, createHalResponse };
