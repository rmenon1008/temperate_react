import './Background.css';
import { useEffect, useRef, useContext, useState } from 'react';
import Attribution from '../Attribution/Attribution';
import { UserStorageContext } from '../UserStorage/UserStorage';

const API_BASE = "http://api.rohanmenon.com/image/"

const Background = (props) => {
    const backgroundImgRef = useRef();

    const context = useContext(UserStorageContext);
    const userStorage = context.userStorage;
    const setUserStorage = context.setUserStorage;

    // useEffect(() => {
    //     if (props.imgUrl) {
    //         backgroundImgRef.current.addEventListener("load", () => {
    //             console.log("background loaded");
    //             backgroundImgRef.current.style.visibility = 'visible';
    //         });
    //     } else {
    //         backgroundImgRef.current.style.visibility = 'visible';
    //     }
    // }, [props.imgUrl]);
    const [profileName, setProfileName] = useState(undefined);
    const [profileLink, setProfileLink] = useState(undefined);

    useEffect(() => {
        if (userStorage.background.autoImage) {
            fetch(API_BASE + userStorage.background.imgSource).then(response => response.json()).then(data => {
                setProfileName(data.credit);
                setProfileLink(data.profile);
                setUserStorage((prev) => {
                    return {
                        ...prev,
                        background: {
                            ...prev.background,
                            imgUrl: data.url
                        }
                    }
                });
                if (userStorage.colors.autoColor) {
                    setUserStorage((prev) => {
                        return {
                            ...prev,
                            colors: {
                                ...prev.colors,
                                cbg: "#ffffff",
                                c1: data.color,
                                c2: data.color,
                                c3: data.bgColor,
                            }
                        }
                    });
                }
            });
        }
    }, []);

    const makeVisible = () => {
        backgroundImgRef.current.style.transform = "scale(1)";
        backgroundImgRef.current.style.opacity = 1;
    }

    const swapImage = (e) => {
        e.preventDefault();
        setUserStorage((prev) => {
            return {
                ...prev,
                background: {
                    ...prev.background,
                    imgOffset: (prev.background.imgOffset + 1) % 3,
                }
            }
        });
        console.log("Swapping image: " + userStorage.background.imgOffset);
    }

    return (
        <div className="Background">
            <img style={{ opacity: 0 }} ref={backgroundImgRef} alt="background" onLoad={makeVisible} src={userStorage.background.imgUrl} draggable="false" />
            <Attribution name={profileName} link={profileLink} show={!!profileName} swapImage={swapImage} />
        </div>
    );
}

export default Background;