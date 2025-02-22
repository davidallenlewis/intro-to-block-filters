import classnames from 'classnames';
import { ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

const { assign, merge } = lodash;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl } = wp.components;

/**
 * Add spacing attributes to Group block
 *
 * @param  {Object} settings Original block settings
 * @param  {string} name     Block name
 * @return {Object}          Filtered block settings
 */
function addAttributes(settings, name) {
	if ( name === 'core/column' ) {
		return assign({}, settings, {
			attributes: merge(settings.attributes, {
				hasInnerSpacing: {
					type: 'boolean',
					default: false,
				},
			}),
		});
	}
	return settings;
}
addFilter(
	'blocks.registerBlockType',
	'block-mods/column-block/add-spacing-attributes',
	addAttributes,
);

/**
 * Add Size control to Group block
 */
const addInspectorControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const {
			attributes: { hasInnerSpacing },
			setAttributes,
			name,
		} = props;
		const toggleHasInnerSpacing = () => {
			setAttributes( {
				hasInnerSpacing: ! hasInnerSpacing,
			} );
		};
		if ( name !== 'core/column' ) {
			return <BlockEdit {...props} />;
		}
		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__('Spacing', 'block-mods')} initialOpen={true}>
						<ToggleControl
							label={__('Inner Spacing', 'block-mods')}
							checked={ hasInnerSpacing }
							onChange={ toggleHasInnerSpacing }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withInspectorControl');
addFilter(
	'editor.BlockEdit',
	'block-mods/column-block/add-spacing-controls',
	addInspectorControl,
);

/**
 * Add spacing classes to the block in the editor
 */
const addSizeClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const {
			attributes: { hasInnerSpacing },
			className,
			name,
		} = props;
		if ( name !== 'core/column' ) {
			return <BlockListBlock {...props} />;
		}
		return (
			<BlockListBlock
				{...props}
				className={ classnames(className, { 'has-inner-spacing' : hasInnerSpacing } ) }
			/>
		);
	};
}, 'withClientIdClassName');
addFilter(
	'editor.BlockListBlock',
	'block-mods/column-block/add-spacing-classes-editor',
	addSizeClassEditor,
);

/**
 * Add class to the block on the front end
 *
 * @param  {Object} props      Additional props applied to save element.
 * @param  {Object} block      Block type.
 * @param  {Object} attributes Current block attributes.
 * @return {Object}            Filtered props applied to save element.
 */
function addSizeClassFrontEnd(props, block, attributes) {
	const { className } = props;
	const { hasInnerSpacing } = attributes;
	if ( block.name === 'core/column' ) {
		return assign({}, props, {
			className: classnames(className, { 'has-inner-spacing' : hasInnerSpacing } ),
		});
	} else {
		return props;
	}
}
addFilter(
	'blocks.getSaveContent.extraProps',
	'block-mods/column-block/add-spacing-classes-public',
	addSizeClassFrontEnd,
);
