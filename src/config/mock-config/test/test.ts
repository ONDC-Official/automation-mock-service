import { getFIS13MockAction } from "../FIS13/action-factory";

// (async () => {
// 	await testFlow();
// })();

(async () => {
	const action = getFIS13MockAction("search");
	console.log(action.mockActionConfig.generator);
})();
