export default class AsyncHelper {
    /**
     * Sleeps for a number of time before calling a function
     * @param time 
     */
    public static async Sleep(time: number, fn: any): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(fn()), 3000)
        });
    }
}