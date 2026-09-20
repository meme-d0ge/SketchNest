import { createContext, useContext, useState } from 'react';
import { RootStore } from '@/app/store/RootStore.ts';

const StoreContext = createContext<RootStore | null>(null);
export const StoreProvider = ({ children }: { children?: React.ReactNode }) => {
	const [rootStore] = useState<RootStore>(() => new RootStore());
	return (
		<StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
	);
};
export const useStore = () => {
	const stores = useContext(StoreContext);
	if (stores === null)
		throw new Error('useStore must be used within a StoreProvider');
	return stores;
};
