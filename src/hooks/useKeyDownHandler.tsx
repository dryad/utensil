import {useEffect, useCallback} from 'react'

export const useKeyDownHandler = (onButton: (nextMode: string) => void, onUndo: () => void, onRedo: () => void) => {

    useEffect(() => {
        document.addEventListener('keydown', keydownHandler, false);
        return () => {
          document.removeEventListener('keydown', keydownHandler, false);
        }
    }, []);

    const keydownHandler = (e: KeyboardEvent) => {
        e.preventDefault();
        // e.stopImmediatePropagation();
        // e.stopPropagation();
        
        if(e.key === 'Escape') { 
            onButton("pan");
        }

        if(e.key === 'h') { 
            onButton("pan");
        }

        if (e.key === 's') {
            onButton("select");
        }

        if (e.key === 't') {
            onButton("text");
        }

        if (e.key === 'g' && e.ctrlKey) {
            onButton('contraction');
        }

        if ( e.shiftKey && e.ctrlKey && e.key === 'G') {
            onButton('expansion');
        }   
        
        if (e.key === 'z' && e.ctrlKey) {
            onUndo();
        }

        if (e.key === 'y' && e.ctrlKey) {
            onRedo();
        }
        e.stopPropagation();
       return false;
    };    
    // const keydownHandler = useCallback((e: KeyboardEvent) => {
    //     e.preventDefault();
    //     e.stopImmediatePropagation();
    //     e.stopPropagation();
        
    //     if(e.key === 'Escape') { 
    //         onButton("pan");
    //     }

    //     if(e.key === 'h') { 
    //         onButton("pan");
    //     }

    //     if (e.key === 's') {
    //         onButton("select");
    //     }

    //     if (e.key === 't') {
    //         onButton("text");
    //     }

    //     if (e.key === 'g' && e.ctrlKey) {
    //         onButton('contraction');
    //     }

    //     if ( e.shiftKey && e.ctrlKey && e.key === 'G') {
    //         onButton('expansion');
    //     }   
        
    //     if (e.key === 'z' && e.ctrlKey) {
    //         onUndo();
    //     }

    //     if (e.key === 'y' && e.ctrlKey) {
    //         onRedo();
    //     }
    //    return false;
    // },  []);    
}