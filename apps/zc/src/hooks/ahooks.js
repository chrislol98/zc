export function useRafState(initialState) {
  const ref = useRef();
  const [state, setState] = useState(initialState);
  const setRafState = useCallback((state) => {
    if (ref.current) cancelAnimationFrame(ref.current);
    ref.current = requestAnimationFrame(() => {
      setState(state);
    });
  }, []);
  // 有可能会漏掉这一步优化
  useUnmount(() => {
    if (ref.current) cancelAnimationFrame(ref.current);
  });
  return [state, setRafState];
}

export function useUnmount(fn) {
  // 不行，这样每次fn变化都执行，我只要在卸载的时候执行一遍而已
  // useEffect(() => fn(), [fn])
  const fnRef = useLatest(fn);
  useEffect(() => () => fnRef.current?.(), [fnRef]);
}

export function useMount(fn) {
  useEffect(() => {
    fn();
  }, []);
}

export function useLatest(val) {
  const ref = useRef(val);
  ref.current = val;
  return ref;
}



export function useMemoizedFn() {
  // 解决函数由于依赖变化导致引用地址变化问题，和useLatest类似原理
  // 并且保证函数里面的state都是最新的
}

export function useScroll(target) {
  const [position, setPosition] = useRafState();

  // 还是不懂用这个useEffectWithTarget的原因
  // target变化的话，事件要重新绑定。target是函数或者ref可能会出问题
  useEffectWithTarget(
    () => {
      const el = getTargetElement(target);
      if (!el) return;

      const updatePosition = () => {
        const newPosition = {};
        setPosition(newPosition);
      };

      updatePosition();
      el.addEventListener('scroll', updatePosition);
      return () => el.removeEventListener('scroll', updatePosition);
    },
    [],
    target
  );

  return position;
}

export function useScroll(target) {
  const [position, setPosition] = useState();

  useEffectWithTarget(
    () => {
      const el = getTargetElement(target);
      if (!el) return;

      const updatePosition = debounce(() => {
        const newPosition = {};
        setPosition(newPosition);
      }, 1);

      updatePosition();
      el.addEventListener('scroll', updatePosition);
      return () => {
        el.removeEventListener('scroll', updatePosition);
        updatePosition.cancel();
      };
    },
    [],
    target
  );

  return position;
}

export function useTimeout(callback, delay) {
  const memorizeCallback = useLatest(callback);

  useEffect(() => {
    if (delay !== null) {
      const timer = setTimeout(() => {
        memorizeCallback.current();
      }, delay);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [delay, memorizeCallback]);
}

// useTimeout


// useSetState()


export function useFullscreen() {


}

export function useHover() {

}


export function useClickAway() {

}

export function useSize() {

}