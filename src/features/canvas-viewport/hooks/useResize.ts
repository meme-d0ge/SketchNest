import { useCallback, useEffect, useState } from 'react';

export const useResize = () => {
	const [[windowWidth, windowHeight], setSizeWindow] = useState<
		[number, number]
	>([window.innerWidth, window.innerHeight]);
	const handlerResize = useCallback(() => {
		setSizeWindow([window.innerWidth, window.innerHeight]);
	}, []);
	useEffect(() => {
		window.addEventListener('resize', handlerResize);
		return () => {
			window.removeEventListener('resize', handlerResize);
		};
	}, [handlerResize]);
	return { windowWidth, windowHeight };
};
