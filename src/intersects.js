class Intersects {
    constructor() {
        this.intersects = new Map;
        this.intersectedLabel = '';
    }

    add(label, obj) {
        this.intersects.set(label, obj);
    }

    remove() {

    }

    get() {
        return this.intersects;
    }

    getLabels() {
        return Array.from(this.intersects.keys());
    }

    getObjs() {
        return Array.from(this.intersects.values());
    }
}

const intersects = new Intersects();
export default intersects;