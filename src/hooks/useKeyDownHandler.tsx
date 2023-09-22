import {useEffect} from 'react'

export const useKeyDownHandler = (onButton: (nextMode: string) => void, onUndo: () => void, onRedo: () => void) => {

    useEffect(() => {
        document.addEventListener('keydown', keydownHandler, false);
        return () => {
          document.removeEventListener('keydown', keydownHandler, false);
        }
    }, []);

    const keydownHandler = (e: KeyboardEvent) => {
        e.preventDefault();
                
        if(e.key === 'Escape') { 
            onButton("pan");
        }

        if(e.key === 'h') { 
            onButton("pan");
        }

        if (e.key === 's') {
            onButton("select");
        }

        if (e.key === 'o') {
            onButton("node");
        }

        if (e.key === 'l') {
            onButton("edge");
        }

        if ( e.shiftKey && e.key === 'L') {
            onButton('directed-edge');
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
        
       return false;
    };            
}