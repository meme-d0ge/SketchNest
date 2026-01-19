import './styles/index.css';
import { StoreProvider } from '@/app/providers/StoreProvider.tsx';
import { HomePage } from '@/pages/home';

function App() {
	return (
		<StoreProvider>
			<HomePage />
		</StoreProvider>
	);
}

export default App;
