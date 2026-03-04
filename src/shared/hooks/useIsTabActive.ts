import { useEffect, useState } from 'react';

export function useIsTabActive() {
	const [isActive, setIsActive] = useState(document.hasFocus());

	useEffect(() => {
		const onChange = () => {
			setIsActive(
				document.visibilityState === 'visible' && document.hasFocus(),
			);
		};

		document.addEventListener('visibilitychange', onChange);
		window.addEventListener('focus', onChange);
		window.addEventListener('blur', onChange);

		onChange();

		return () => {
			document.removeEventListener('visibilitychange', onChange);
			window.removeEventListener('focus', onChange);
			window.removeEventListener('blur', onChange);
		};
	}, []);

	return isActive;
}
