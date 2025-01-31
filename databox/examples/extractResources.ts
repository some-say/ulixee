import Databox from '@ulixee/databox';

export default new Databox({
  async run({ hero }) {
    await hero.goto('https://ulixee.org');

    const resources = await hero.activeTab.waitForResources({ url: 'index.json' });
    for (const resource of resources) await resource.$extractLater('xhr');
  },
  async extract({ collectedResources, output }) {
    const xhrs = await collectedResources.getAll('xhr');
    output.gridsomeData = [];
    console.log(xhrs);
    for (const xhr of xhrs) {
      // NOTE: synchronous APIs.
      const jsonObject = xhr.json;
      console.log(jsonObject);
      if (jsonObject.data) {
        output.gridsomeData.push(jsonObject.data);
      }
    }
  },
});
