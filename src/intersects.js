import { Vector2, Raycaster } from "three";
import Scene from "./scene.js";
import { getCarouselMovingState } from "../index.js";

class Intersects {
    constructor() {
        // list of objects available for raycast
        this.intersectList = new Map();

        // deal with pointermove event
        this.intersectedLabel = '';
        this.intersects = null;
        this.intersectedObject = null;
        this.lastIntersectedObject = null;

        // deal with pointerdown event
        this.clickedLabel = '';
        this.clicks = null;
        this.clickedObject = null;
        this.lastClickedObject = null;
        this.clickCbs = new Map(); // map of {'label', cb} for pointerdown events

        this.pointer = new Vector2();
        this.raycaster = new Raycaster();

        this.handleWheelAndPointerMove.bind(this);
        this.handlePointerUp.bind(this);
    }

    handleWheelAndPointerMove(e) {
        this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

        this.raycaster.setFromCamera( this.pointer, this.camera );
        this.intersects = this.raycaster.intersectObjects( this.getObjs() );
        if (this.intersects.length === 0) {
            document.body.style.cursor = '';
            this.intersectedLabel = '';
            this.intersectedObject = null;
            return;
        }
        document.body.style.cursor = 'pointer';
        this.intersectedLabel = this.intersects[0].object.userData.label;
        this.lastIntersectedObject = this.intersectedObject;
        this.intersectedObject = this.intersects[0].object;
    }

    handlePointerUp(e) {
        if (getCarouselMovingState()) return;

        this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

        this.raycaster.setFromCamera( this.pointer, this.camera );
        this.clicks = this.raycaster.intersectObjects( this.getObjs() );
        document.body.style.cursor = '';
        if (this.clicks.length === 0) {
            this.clickedLabel = '';
            this.clickedObject = null;
            return;
        }
        this.clickedLabel = this.clicks[0].object.userData.label;
        this.lastClickedObject = this.clickedObject;
        this.clickedObject = this.clicks[0].object;

        let clickCbs = this.clickCbs.get(this.clickedLabel);
        if (!clickCbs) return;
        clickCbs.forEach(cb => cb());
    }

    addClickCb(label, cb) {
        if (!this.clickCbs.has(label)) {
            this.clickCbs.set(label, [cb]);
        } else {
            let clickCbs = this.clickCbs.get(label);
            clickCbs.push(cb);
        }
    }

    init() {
        this.camera = Scene.getInternals().camera;

        let canvasParentDiv = document.querySelector('#three-js-canvas');

        canvasParentDiv.addEventListener('wheel', (e) => {
            this.handleWheelAndPointerMove(e);
        })

        canvasParentDiv.addEventListener('pointermove', (e) => {
            this.handleWheelAndPointerMove(e);
        })

        canvasParentDiv.addEventListener('pointerup', (e) => {
            this.handlePointerUp(e);
        })
    }

    add(label, obj) {
        this.intersectList.set(label, obj);
    }

    remove() {

    }

    get() {
        return this.intersectList;
    }

    getLabels() {
        return Array.from(this.intersectList.keys());
    }

    getObjs() {
        return Array.from(this.intersectList.values());
    }
}

const intersects = new Intersects();
export default intersects;