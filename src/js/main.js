/*
* Gestion des onglets
*/
var Onglet = function(name){
	var self = this;
	this.self = self;

	this.name = name;
	this.el = document.querySelector(name);

	this.animate = function(){
		console.log(self.el);
		self.el.addEventListener("click",function(){
			self.el.classList.toggle('onglet-deep');
		});
	};
	this.select = function(){
		console.log("select");
		self.el.classList.toggle('onglet-select');
	};
	this.setBounds = function(next_el){
		self.el.offsetTop;
		document.querySelector(next_el).offsetTop;
	}
	//TODO : show element (toggle onglet-select) when scroll under 'element'  
	this.show = function(start_el, next_el){
		console.log("show");
		var s_to,next_to;
		try{
			s_to = document.querySelector(start_el).offsetTop;
			next_to = document.querySelector(next_el).offsetTop;
		}catch(e){
			console.log('start_el or next_el not found ('+start_el+", "+next_el+")");
			return;
		}

		console.log("start : "+ s_to + " next : " + next_to);
		var scrollTop = window.scrollY;
		console.log(scrollTop);
		if(s_to >= scrollTop && next_to >= scrollTop){
			console.log("if show");
			self.select();
		}
	};
};
// elements = list of objects : {start, next};
function scrollHandler(elements){
	for(var i = 0; i < elements.length; i++){

	}
	accueil.show(".pos-accueil",".pos-informations");
	informations.show(".pos-informations",".pos-projets");
}

var accueil = new Onglet('#accueil');
	// accueil.select();
	accueil.animate();

var informations = new Onglet('#informations');
	// accueil.select();
	informations.animate();

window.addEventListener('scroll',function(){
	scrollHandler();
});
