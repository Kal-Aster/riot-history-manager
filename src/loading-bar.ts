let loadingBar: HTMLElement = document.body.appendChild(document.createElement("div"));
let loadingBarContainer: HTMLElement = document.body.appendChild(document.createElement("div"));
loadingBarContainer.setAttribute(
    "style",
    "position: fixed; top: 0; left: 0; right: 0; height: 4px; z-index: 999999; background: rgba(250, 120, 30, .5); display: none;"
);
loadingBar = loadingBarContainer.appendChild(document.createElement("div"));
loadingBar.setAttribute(
    "style",
    "height: 100%; width: 100%; background: rgb(250, 120, 30) none repeat scroll 0% 0%; transform-origin: center left;"
);
let actualClaimedBy: any = null;
let nextFrame: number = -1;
let loadingProgress: number = 0;
let loadingDone: boolean = false;
// velocità della barra, in funzione del progresso, finchè non è stato ancora terminato il caricamento
let progressVel: (progress: number) => number = (progress) => {
    return (8192 - (1.08 * progress * progress)) / 819.2;
};
// tempo di visibilità della barra, da quando ha il progresso è completo
const visibilityTime: number = 300;
let doneTime: number = visibilityTime;
let claimedWhenVisible: number = 0;
function startLoading(): void {
    // se era già previsto un aggiornamento della barra, annullarlo
    if (nextFrame) {
        cancelAnimationFrame(nextFrame);
    }
    let lastTime: number;
    let eventDispatched: boolean = false;
    let step: () => void = () => {
        nextFrame = -1;
        if (loadingDone && loadingProgress === 5 && claimedWhenVisible === 5) {
            loadingProgress = 100;
            loadingBarContainer.style.display = "none";
            window.dispatchEvent(new Event("routerload"));
            return;
        }
        let last: number = lastTime;
        let delta: number = ((lastTime = Date.now()) - last);
        // se il progresso della barra è completo, attendere che passi il tempo previsto prima di nasconderla
        if (loadingProgress >= 100) {
            if (!eventDispatched) {
                window.dispatchEvent(new Event("routerload"));
                eventDispatched = true;
            }
            if ((doneTime -= delta) <= 0) {
                doneTime = visibilityTime;
                loadingBarContainer.style.display = "none";
            } else {
                requestAnimationFrame(step);
            }
            return;
        }
        // se il caricamento è determinato, aggiungere un valore fisso per raggiungere il completamento
        // altrimenti richiedere la velocità alla funzione designata
        if (loadingDone) {
            loadingProgress += delta / 2;
        } else {
            loadingProgress += delta * progressVel(loadingProgress) / 100;
        }
        // applicare il progresso
        loadingBar.style.transform = "scaleX(" + (loadingProgress / 100) + ")";
        // richiedere il prossimo aggiornamento della barra
        nextFrame = requestAnimationFrame(step);
    };
    // visualizzare la barra
    loadingBarContainer.style.display = "block";
    lastTime = Date.now();
    step();
}
let lastClaim: number;
export function claim(claimer: any): void {
    if (claimer == null) {
        return;
    }
    // ricomincia il progresso della barra, gestita da un altro processo
    actualClaimedBy = claimer;
    claimedWhenVisible = loadingBarContainer.style.display === "block" ? loadingProgress : 5;
    loadingProgress = 5;
    loadingDone = false;
    lastClaim = Date.now();
    startLoading();
}
export function claimedBy(claimer: any): boolean {
    return claimer != null && claimer === actualClaimedBy;
}
export const claimed: typeof claimedBy = claimedBy;
export function release(claimer: any): void {
    // se chi ha chiamato questa funzione è lo stesso che ha chiamato
    // per ultimo la funzione precedente, allora termina il caricamento
    if (claimer == null || actualClaimedBy !== claimer) {
        return;
    }
    // console.log("claim end at", Date.now() - lastClaim + "ms");
    loadingDone = true;
}
export function isLoading(): boolean {
    return nextFrame !== -1;
}