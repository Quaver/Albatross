export default class StringHelper {
    /**
     * Gets a query parameter from a URL
     * @param url
     * @param name
     * @constructor
     */
    public static GetUrlParameter(url: string,  name: string): string | null {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        const results = regex.exec(url);
        return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}