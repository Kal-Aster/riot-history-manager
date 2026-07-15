declare module "*.riot" {
    import { RiotComponent, RiotComponentWrapper } from "riot";
    const shell: RiotComponentWrapper<RiotComponent>;

    export default shell;
}
