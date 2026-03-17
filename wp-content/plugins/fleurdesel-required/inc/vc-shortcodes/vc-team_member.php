<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register team member content element
 */
function vcmap_fleurdesel_team_member() {

	$params = array(
		array(
			'type'        => 'attach_image',
			'param_name'  => 'avatar',
			'heading'     => esc_html__( 'Avatar', 'fleurdesel' ),
			'admin_label' => true,
		),
		array(
			'type'        => 'textfield',
			'param_name'  => 'name',
			'heading'     => esc_html__( 'Name', 'fleurdesel' ),
			'admin_label' => true,
		),
		array(
			'type'        => 'textfield',
			'param_name'  => 'position',
			'heading'     => esc_html__( 'Position', 'fleurdesel' ),
		),
		array(
			'type'        => 'textfield',
			'param_name'  => 'facebook',
			'heading'     => esc_html__( 'Facebook', 'fleurdesel' ),
		),
		array(
			'type'        => 'textfield',
			'param_name'  => 'twitter',
			'heading'     => esc_html__( 'Twitter', 'fleurdesel' ),
		),
		array(
			'type'        => 'textfield',
			'param_name'  => 'instagram',
			'heading'     => esc_html__( 'Instagram', 'fleurdesel' ),
		),
		array(
			'type'        => 'textfield',
			'param_name'  => 'pinterest',
			'heading'     => esc_html__( 'Pinterest', 'fleurdesel' ),
		),
		array(
			'type'        => 'textfield',
			'param_name'  => 'tumblr',
			'heading'     => esc_html__( 'Tumblr', 'fleurdesel' ),
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Team Member', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display a team member.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_team_member', 'vcmap_fleurdesel_team_member' );

/**
 * WPBakeryShortCode_Fleurdesel_Team_Member
 */
class WPBakeryShortCode_Fleurdesel_Team_Member extends Fleurdesel_Shortcode_Abstract {
}
