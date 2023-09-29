import { useEffect, useRef, memo } from "react";
import SmallVisCustomNetwork from "libs/small-vis-custom-network";

type INetworkProps = {
  networkRef: any;
  width?: string;
  height?: string;
};

const SmallNetwork = ({ networkRef, width='100px', height='80px' }: INetworkProps) => {
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!networkRef.current && domRef.current) {
        networkRef.current = new SmallVisCustomNetwork(domRef.current);
      }
    }, [networkRef]);
    
    return (
      <div ref={domRef} style={{ height: height, width: width, background: '#fff' }} />
    );
  }

export default memo(SmallNetwork);
