export class Task {
    // control IDs
    static counterID = 1; //

    constructor(name) {
        this.id = Task.counterID++; // id único
        this.name = name;
        this.status = false;
    }

    uptateStatusTask () {
        this.status = !this.status; // marcar completada
    }
}