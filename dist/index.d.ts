declare namespace loadingBar {
    function claim(claimer: any): void;
    function claimedBy(claimer: any): boolean;
    const claimed: typeof claimedBy;
    function release(claimer: any): void;
    function isLoading(): boolean;
    function setColor(color: string): void;
}
declare const components: {
    RhmNavigate: any;
    RhmRouter: any;
    RhmRoute: any;
};
export { components, loadingBar };
