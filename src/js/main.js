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
		self.el.classList.toggle('onglet-select');
	};
	//TODO : show element (toggle onglet-select) when scroll under 'element'  
	this.show = function(element){
		document.querySelector(element);
	};
};

var accueil = new Onglet('#accueil');
accueil.select();
accueil.animate();
