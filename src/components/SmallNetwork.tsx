import { useEffect, useRef, memo } from "react";
import VisCustomNetwork from "libs/vis-custom-network";

type INetworkProps = {
  networkRef: any;
};

const SmallNetwork = ({ networkRef }: INetworkProps) => {
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!networkRef.current && domRef.current) {
        networkRef.current = new VisCustomNetwork(domRef.current);
      }
    }, [networkRef]);

    return (
      <div ref={domRef} style={{ height: `100px`, width: `100px` }} />
    );
  }

export default memo(SmallNetwork);
