import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isCmsUi } from '@plone/volto/helpers';
import PropTypes from 'prop-types';
import {
  DEFAULT_SOCIAL,
  DEFAULT_POSITIONS,
  DEFAULT_LOGO_SIZE,
  DEFAULT_BUTTON_SIZE,
} from './defaultSettings';
import './SocialSharing.css';
import './fontawesome';
import { SOCIAL_INTERFACE, LOGO_SIZE_INTERFACE } from './interfaces';

const SocialSharing = ({
  location,
  socialElements = DEFAULT_SOCIAL,
  bannerPosition = DEFAULT_POSITIONS,
  logoSize = DEFAULT_LOGO_SIZE,
  buttonSize = DEFAULT_BUTTON_SIZE,
  asContent = false,
}) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const pathName = location?.pathname;
  const [display, setDisplay] = useState(Boolean(pathName));

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // Disable sharing on non content routes
  useEffect(() => {
    pathName && setDisplay(!isCmsUi(pathName));
  }, [pathName]);

  // MOBILE checker
  const [isMobile, setIsMobile] = useState(false);

  function handleWindowSizeChange() {
    setIsMobile(window.innerWidth <= 768);
  }
  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);
  // end - MOBILE checker

  return (
    <>
      {display && (
        <div
          style={
            asContent ? undefined : isMobile ? bannerPosition['mobile'] : bannerPosition['desktop']
          }
        >
          <ul
            className={
              asContent ? 'horizontal-content volto-social-sharing'
              : isMobile ? 'horizontal volto-social-sharing'
                : 'vertical volto-social-sharing'
            }
          >
            {socialElements
              .filter((social) => !social.only_mobile === !isMobile || isMobile)
              .map((social) => {
                return (
                  <li
                    className={`volto-social-${social.id}`}
                    key={social.id}
                    style={ asContent ? null : { backgroundColor: social.color }}
                  >
                    <div
                      style={{
                        width: buttonSize,
                        height: buttonSize,
                        left: `calc(50% - ${buttonSize} / 2)`,
                      }}
                      className="icon-container"
                    >
                      <a
                        target="_blank"
                        title={`Send to ${social.name}`}
                        href={`${social.sharing_url}${currentUrl}`}
                        className="fa-icon-position"
                        rel="noreferrer"
                      >
                        <FontAwesomeIcon
                          icon={social.fa_name}
                          color="white"
                          size={logoSize}
                          className="fa-icon"
                        />
                      </a>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </>
  );
};

SocialSharing.propTypes = {
  socialElements: PropTypes.arrayOf(SOCIAL_INTERFACE),
  bannerPosition: PropTypes.object,
  logoSize: LOGO_SIZE_INTERFACE,
  buttonSize: PropTypes.string,
};

export default SocialSharing;
