import { getMockAction } from "../TRV13/action-factory";
import { testFlow, testUnitApi } from "./mock-testing";

// (async () => {
// 	await testFlow();
// })();

(async () => {
const action = getMockAction("search_1");
console.log(action.name());
})();
