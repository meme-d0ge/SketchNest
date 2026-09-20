import { ElementsStore, InteractiveStore } from '@/entities/elements';
import { PropertiesStore } from '@/entities/properties';
import { ToolsStore } from '@/entities/tools';

export class RootStore {
	app;
	pages;
	widgets;
	features;
	entities: {
		toolsStore: ToolsStore;
		elementsStore: ElementsStore;
		interactiveStore: InteractiveStore;
		propertiesStore: PropertiesStore;
	};

	constructor() {
		this.app = {};
		this.pages = {};
		this.widgets = {};
		this.features = {};
		this.entities = {
			toolsStore: new ToolsStore(),
			elementsStore: new ElementsStore(),
			interactiveStore: new InteractiveStore(),
			propertiesStore: new PropertiesStore(),
		};
	}
}
