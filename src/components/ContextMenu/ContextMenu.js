import { useEffect, useCallback, useState, useRef } from "react";
import { Cog, Refresh } from '@styled-icons/heroicons-outline';


import './ContextMenu.css';

const ContextMenu = () => {
    const [show, setShow] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

    const options = () => { window.open("?options.html") }
    const swapBackground = () => { window.open("/swapBackground.html") }

    const contextMenuRef = useRef(null);

    const handleClick = useCallback((e) => {
        console.log("click", e.target);
        setShow(false);
    }, []);

    const handleContextMenu = (event) => {
        console.log("show", show);
        setShow((prev) => {
            if (!prev) {
                event.preventDefault();
                let x = event.clientX;
                let y = event.clientY;
                const rect = contextMenuRef.current.getBoundingClientRect();
                if (y > window.innerHeight - rect.height) {
                    y = event.clientY - rect.height;
                }
                if (x > window.innerWidth - rect.width) {
                    x = event.clientX - rect.width;
                }
                setAnchorPoint({ x, y });
                return true;
            }
        });
    }

    const visibilityChange = useCallback(() => {
        console.log("visibilityChange", show);
        setShow(false);
    }, []);

    useEffect(() => {
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("click", handleClick);
        document.addEventListener("visibilitychange", visibilityChange);
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("click", handleClick);
            document.removeEventListener("visibilitychange", visibilityChange);
        }
    }, []);

    return (
        <div className="context-menu" ref={contextMenuRef} style={{ opacity: (show ? 1 : 0), top: anchorPoint.y, left: anchorPoint.x }}>
            <div className="context-menu-item" onClick={options}>
                <Cog />
                Options
            </div>
            <div className="context-menu-item" onClick={swapBackground}>
                <Refresh />
                Swap background
            </div>
        </div>
    )
}

export default ContextMenu;