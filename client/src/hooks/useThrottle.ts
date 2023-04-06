// 节流hooks
import { useRef, useCallback } from 'react'
type FnType = (...arg: any[]) => any
interface RefType {
  fn: FnType
  timer: NodeJS.Timeout | null
}
 function useThrottle(fn: FnType, delay: number,setLoading: (value: boolean) => void, dep: any[] = []) {
  const { current } = useRef<RefType>({ fn, timer: null })
  current.fn = fn
  console.log(fn);
  
  return useCallback((...args: any[]) => {
    // console.log(args[0]);
    if (!current.timer) {
      current.timer = setTimeout(() => {
        current.timer = null
        setLoading(false);
      }, delay)
      current.fn.apply( args)
      setLoading(true); 
    }
  }, dep)
}

export default useThrottle