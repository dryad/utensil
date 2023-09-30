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

        if (e.key === 's') {
            onButton("pan");
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

        if (e.key === 'd') {
            onButton("delete");
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