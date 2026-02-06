const pluginRss = require("@11ty/eleventy-plugin-rss");

const english = new Intl.DateTimeFormat("en-US");

const fg = require('fast-glob');

const initSidebarImg = fg.sync(["**/leftSidebar/*", "!**/_site"]);

const sidebarImg= initSidebarImg.map((s) => {
	const indexOfSlash = s.indexOf("/");
	return s.slice(indexOfSlash);
});

module.exports = eleventyConfig => {

	eleventyConfig.addFilter("niceDate", function(d) {

		return english.format(d);
	
	});

	eleventyConfig.addPlugin(pluginRss);

	eleventyConfig.addShortcode('excerpt', post => extractExcerpt(post));

	function extractExcerpt(post) {
		if(!post.templateContent) return '';
		if(post.templateContent.lastIndexOf('</p>') > 0) {
			let end = post.templateContent.lastIndexOf('</p>');
			return post.templateContent.substr(0, end+4);
		}
		return post.templateContent;
	}

	eleventyConfig.addCollection("sidebar", function(collectionApi){
		return sidebarImg;
	});

	eleventyConfig.addCollection("currentlyXYZ", function(collectionApi){
		let currentlyXYZ = collectionApi.getFilteredByTag('sidebar');
		return currentlyXYZ;
	});

	eleventyConfig.addCollection("categories", function(collectionApi){
		let categories = new Set();
		let posts = collectionApi.getFilteredByTag('post');
		posts.forEach(p => {
			let cats = p.data.categories;
			cats.forEach(c => categories.add(c));
		});
		
		return Array.from(categories);
	});

	eleventyConfig.addFilter("filterByCategory", function(posts, cat) {
	
	cat = cat.toLowerCase();
	
	let result = posts.filter(p => {
	
		let cats = p.data.categories.map(s => s.toLowerCase());
		return cats.includes(cat);
	
	});
	
		return result;
	
	});

	eleventyConfig.addPassthroughCopy("northofpolar.is/images/");
	
	eleventyConfig.addPassthroughCopy("northofpolar.is/css/");

	eleventyConfig.addPassthroughCopy("northofpolar.is/fonts/");

	eleventyConfig.addWatchTarget("northofpolar.is/images/");

	eleventyConfig.addWatchTarget("northofpolar.is/css/");

	return {
		dir: {
			input: 'northofpolar.is'
		}
	}
};
