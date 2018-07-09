import setupActions from "../actions/SetupActions";
import setupServerActions from "../actions/SetupServerActions";
import alt from "../renderer/alt";
class SetupStore {
    constructor() {
        this.bindActions(setupActions);
        this.bindActions(setupServerActions);
        this.started = false;
        this.progress = null;
        this.error = null;
    }
    started({ started }) {
        this.setState({ error: null, started });
    }
    error({ error }) {
        this.setState({ error, progress: null });
    }
    progress({ progress }) {
        this.setState({ progress });
    }
}
export default alt.createStore(SetupStore);
//# sourceMappingURL=SetupStore.js.map