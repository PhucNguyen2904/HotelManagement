<?php

class WTB_PostTypes {

    function __construct() {
        // Register post types
        add_action('init', array($this, 'addBlockPostType'));
    }

    // Register static block post type
    function addBlockPostType() {
        register_post_type(
            'block', array(
                'labels'                => $this->getLabels(esc_html__('Static Block', 'shtheme'), esc_html__('Static Block', 'shtheme')),
                'exclude_from_search'   => true,
                'has_archive'           => false,
                'publicly_queryable'    => false,
                'public'                => true,
                'rewrite'               => array('slug' => 'block'),
                'supports'              => array('title', 'editor'),
                'can_export'            => true,
                'menu_icon'             => 'dashicons-layout',
            )
        );
    }

    // Get content type labels
    function getLabels($singular_name, $name, $title = FALSE) {
        if ( ! $title )
            $title = $name;

        return array(
            "name"          => $title,
            "singular_name" => $singular_name,
            "add_new"       => esc_html__("Add New", 'shtheme'),
            "add_new_item"  => sprintf(esc_html__("Add New %s", 'shtheme'), $singular_name),
            "edit_item"     => sprintf(esc_html__("Edit %s", 'shtheme'), $singular_name),
            "new_item"      => sprintf(esc_html__("New %s", 'shtheme'), $singular_name),
            "view_item"     => sprintf(esc_html__("View %s", 'shtheme'), $singular_name),
            "search_items"  => sprintf(esc_html__("Search %s", 'shtheme'), $name),
            "not_found"     => sprintf(esc_html__("No %s found", 'shtheme'), $name),
            "not_found_in_trash" => sprintf(esc_html__("No %s found in Trash", 'shtheme'), $name),
            "parent_item_colon"  => "",
        );
    }

}

new WTB_PostTypes();