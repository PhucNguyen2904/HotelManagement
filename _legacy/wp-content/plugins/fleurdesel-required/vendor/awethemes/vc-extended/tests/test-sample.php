<?php
/**
 * Class SampleTest
 *
 * @package Wp_Extended_Test
 */

/**
 * Sample test case.
 */
class SampleTest extends WP_UnitTestCase {

	public function test_build_attributes_ok() {
		$test_attr = array(
			'id' => 'test-id',
			'name' => 'test-name',
			'data-foo' => 'bar',
			'required',
		);

		$test_attr = vc_extended_build_attributes($test_attr);
		$asser_attr = 'id="test-id" name="test-name" data-foo="bar" required="required"';

		$this->assertEquals(trim($test_attr), $asser_attr);
	}
}
