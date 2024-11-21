import { Vector2, Raycaster } from "three";
import Scene from "./scene.js";

class Intersects {
    constructor() {
        this.intersectList = new Map;
        this.intersectedLabel = '';
        this.intersects = null;
        this.intersectedObject = null;
        this.lastIntersectedObject = null;

        this.pointer = new Vector2();
        this.raycaster = new Raycaster();
    }

    init() {
        let camera = Scene.getInternals().camera;

        document.addEventListener('pointermove', (e) => {
            this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
            this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

            this.raycaster.setFromCamera( this.pointer, camera );
            this.intersects = this.raycaster.intersectObjects( this.getObjs() );
            // console.log(this.intersects);
            if (this.intersects.length === 0) {
                this.intersectedLabel = '';
                this.intersectedObject = null;
                return;
            }
            this.intersectedLabel = this.intersects[0].object.userData.label;
            this.lastIntersectedObject = this.intersectedObject;
            this.intersectedObject = this.intersects[0].object;
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