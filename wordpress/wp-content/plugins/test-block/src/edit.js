import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ColorPicker } from '@wordpress/components';

// Import du CSS Citeo
import '@citeo/css-kit/dist/css/common/core.css';
import './editor.scss';

// Import des composants React Citeo
import { DsCiteoButton, DsCiteoIcon } from '@citeo/react';

export default function Edit({ attributes, setAttributes }) {
  const { iconName = 'icon-core_arrow-right', iconColor = '#0073aa' } = attributes;

  // Liste des icônes disponibles
  const availableIcons = [
    { name: 'icon-core_arrow-right', label: 'Flèche droite' },
    { name: 'icon-core_agreement', label: 'Accord' },
    { name: 'icon-core_abandoned-waste', label: 'Déchet abandonné' },
    { name: 'icon-core_acceleration', label: 'acceleration' },
    { name: 'icon-core_adaptability', label: 'adaptability' },
    { name: 'icon-core_archive', label: 'archive' },
    { name: 'icon-core_balance', label: 'archive' },
    { name: 'icon-core_camera-off', label: 'camera' },
    { name: 'icon-core_coffee', label: 'coffee' },
    { name: 'icon-core_euro-sign', label: 'euro' },
    { name: 'icon-core_gift', label: 'gift' },
    { name: 'icon-core_github', label: 'github' },
    { name: 'icon-core_headphones', label: 'headphones' },
    { name: 'icon-core_github', label: 'github' },
    { name: 'icon-core_lightweight-packaging', label: 'lightweight-packaging' },

  ];

  const handleIconSelect = (selectedIconName) => {
    setAttributes({ iconName: selectedIconName });
  };

  const handleColorChange = (color) => {
    setAttributes({ iconColor: color });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Sélecteur d\'icônes', 'test-block')}>
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '16px',
            justifyContent: 'flex-start'
          }}>
            {availableIcons.map((icon) => (
              <button
                key={icon.name}
                onClick={() => handleIconSelect(icon.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  padding: '0',
                  border: iconName === icon.name ? '2px solid #0073aa' : '1px solid #ddd',
                  borderRadius: '4px',
                  background: iconName === icon.name ? '#f0f8ff' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  zIndex: 1
                }}
                title={icon.label}
              >
                <DsCiteoIcon 
                  name={icon.name} 
                  style={{ 
                    fontSize: '14px', 
                    pointerEvents: 'none',
                    color: iconName === icon.name ? iconColor : '#666'
                  }}
                />
              </button>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
            {__('Cliquez sur une icône pour la sélectionner', 'test-block')}
          </p>
        </PanelBody>
        
        <PanelBody title={__('Couleur de l\'icône', 'test-block')}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              {__('Choisir une couleur:', 'test-block')}
            </label>
            <ColorPicker
              color={iconColor}
              onChange={handleColorChange}
              enableAlpha
            />
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px'
          }}>
            {/* <span style={{ fontSize: '12px' }}>{__('Aperçu:', 'test-block')}</span>
            <DsCiteoIcon 
              name={iconName} 
              style={{ fontSize: '20px', color: iconColor }}
            /> */}
          </div>
        </PanelBody>
      </InspectorControls>

      <div {...useBlockProps()}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#333' }}>
            {__('Icône Citeo Design System', 'test-block')}
          </h3>
          
          <div 
            className="citeo-main-icon"
            style={{
              padding: '24px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              // boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '16px',
              '--icon-custom-color': iconColor
            }}>
            <DsCiteoIcon 
              name={iconName} 
              style={{ 
                fontSize: '4rem', 
                color: iconColor,
                display: 'block',
                '--ds-citeo-icon-color': iconColor,
                '--icon-color': iconColor,
                fill: iconColor,
                // stroke: iconColor
              }}
            />
          </div>
          
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '8px'
          }}>
            <strong>Icône:</strong> {availableIcons.find(icon => icon.name === iconName)?.label}
          </div>
          
          <div style={{
            fontSize: '14px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {/* <strong>Couleur:</strong>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: iconColor,
              borderRadius: '50%',
              border: '1px solid #ccc'
            }}></div>
            <span>{iconColor}</span> */}
          </div>
        </div>
      </div>
    </>
  );
}
