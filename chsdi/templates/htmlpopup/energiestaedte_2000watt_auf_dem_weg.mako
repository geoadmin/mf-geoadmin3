<%inherit file="base.mako"/> 

<%def name="table_body(c, lang)">
<tr>
  <td class="cell-left">${_('gemeinde_stadt')}</td>
  <td>${c['attributes']['name'] or '-'}</td>
</tr>
</%def>
<%def name="extended_info(c, lang)">
<table class="table-with-border kernkraftwerke-extended" cellpadding="5">
  <tr>
    <th class="cell-meta">
      ${_('auf_dem_weg_gemeinde')}
    </th>
    <td>
      ${c['attributes']['name']}
    </td>
  </tr>
  <tr>
    <th class="cell-meta">
      ${_('berater')}
    </th>
  % if c['attributes']['linkberater'] is None:
    <td class="cell-meta"> - </td>
  % else:
    <td class="cell-meta">
      <a target="_blank" href="${c['attributes']['linkberater']}">${c['attributes']['berater']}</a>
    </td>
  % endif
  </tr>
  <tr>
    <th class="cell-meta">
      ${_('faktenblatt')}
    </th>
  % if c['attributes']['linkfaktenblatt'] is None:
    <td class="cell-meta"> - </td>
  % else:
    <td class="cell-meta">
       <a target="_blank" href="${c['attributes']['linkfaktenblatt']}">${_('link')}</a>
    </td>
  % endif
  </tr>
  <tr>
    <th class="cell-meta" colspan="2">
      ${_('kurzerklaerung')}
    </th>
  </tr>
  <tr>
  % if lang=='fr':
    <td class="cell-meta" colspan="2"><p align="justify">
La société à 2000 watts reflète la volonté de construire un avenir communautaire, équitable et attrayant. Cette stratégie est axée sur deux pôles: les besoins en énergie et les émissions de gaz à effet de serre. A moyen terme, chaque habitant ne devrait consommer durablement que 2000 watts d’énergie et ne produire qu’une tonne de CO2 par an. De nombreuses villes et communes se sont engagées au cours des dernières années à respecter ces objectifs et les ont intégrés à leurs directives de politique énergétique.

Label: le label «Cité de l’énergie ouvrant la voie vers la société à 2000 watts» est octroyé aux Cités de l’énergie qui se distinguent par des objectifs visionnaires et exemplaires dans le cadre de la philosophie de la société à 2000 watts. Il est décerné conjointement par l’Office fédéral de l’énergie et par l’association Cité de l’énergie. 

Communes pionnières: ces dernières années, plusieurs villes et communes ont creusé l’idée d’une société à 2000 watts et ont marqué son développement de leur empreinte par leurs actions volontaristes et progressistes.

Concept: dans le cadre du programme de soutien de l’OFEN «Mise en œuvre de la société à 2000 watts», les Cités de l’énergie établissent dans un premier temps un bilan et une stratégie conformément aux critères de la société à 2000 watts afin de poursuivre des objectifs de réduc-tion individuels. Dans un second temps, elles choisissent et concrétisent des projets adaptés sur la base du bilan local, de l’analyse du poten-tiel et des objectifs de réduction.
    </p></td>
  % elif lang=='it':
    <td class="cell-meta" colspan="2"><p align="justify">
La società a 2000 Watt è il progetto di uno scenario futuro comune, equo e allettante. Gli indicatori principali su cui si basa sono il «fabbisogno energetico» e le «emissioni di CO2»: a medio termine ogni abitante potrà consumare 2000 Watt ed emettere 1 tonnellata di CO2 l'anno. Negli ultimi anni molti Comuni e città si sono impegnati a raggiungere gli obiettivi della società a 2000 Watt e li hanno integrati nelle loro direttive in materia di politica energetica. 

Label: il label «Città dell'energia verso la Società a 2000 Watt» è un riconoscimento che viene conferito a Città dell'energia selezionate per i loro obiettivi innovatori di ordine generale ai sensi della filosofia a 2000 Watt. Il certificato viene rilasciato dall'Ufficio federale dell'energia (UFE) e dall'Associazione Città dell'energia. 

Città e Comuni pionieri: negli ultimi anni, singole città e Comuni hanno dato un'impronta determinante e hanno contribuito allo sviluppo dell'idea di una società a 2000 Watt attraverso misure innovatrici e lungimiranti. 

Programma: nell'ambito del programma di soste-gno dell'UFE «Concetti 2000 Watt», in una prima fase queste città hanno elaborato bilanci e progetti sulla base dei criteri della società a 2000 Watt al fine di percorrere il proprio percorso di riduzione del consumo energetico. In una seconda fase, vengono scelti e attuati progetti adatti al luogo sulla base del bilancio locale vigente, dell'analisi del potenziale e della riduzione progressiva definita.
    </p></td>
  % elif lang=='en' :
    <td class="cell-meta" colspan="2"><p align="justify">
The idea of a “2000-watt society” is a vision for a shared, just and attractive future. The concept focuses on the two central indicators, “energy demand” and “greenhouse gas emissions”. According to the defined vision, in the medium term each resident is entitled to a permanent energy consumption of 2000 watts and an annual level of CO2 emissions of not more than 1 tonne. In the past few years, a large number of municipalities and cities have undertaken a commitment to these 2000-watt goals and incorporated them into their energy policy guidelines.

Label: The Energy City on the Path Towards a “2000-Watt Society” label is awarded to municipalities that pursue visionary overlying objec-tives in line with the 2,000-watt philosophy. The certificate is issued jointly by the Swiss Federal Office of Energy and the Energy City Association.

Pioneering approach: In the past few years, a number of cities and municipalities have signifi-cantly influenced and codetermined the devel-opment of the 2000-watt concept through their progressive actions and forward-looking approach.

Concept: Within the scope of the SFOE’s “2000-watt concepts” support programme, in an initial phase these energy cities began to carry out energy accounting and define concepts with the aim of embarking on their own reduction path. In a second phase, based on the criteria arising from the existing local accounting data, an anal-ysis of the identified potentials and the defined reduction path, projects attuned to the local circumstances are to be selected and subsequently implemented.
     </p></td>
  % else :
    <td class="cell-meta" colspan="2"><p align="justify"> 
Die 2000-Watt-Gesellschaft ist eine Vision für eine gemeinschaftliche, gerechte und attraktive Zukunft. Der Fokus dieses Zukunftskonzepts liegt dabei auf den beiden Leitindikatoren «Energiebedarf» und «Treibhausgasemissionen». Jedem Einwohner und jeder Einwohnerin stehen demnach mittelfristig ein dauerhafter Energiebezug von 2000 Watt und die Emissionen von 1 Tonne CO2 pro Jahr zu. Viele Gemeinden und Städte haben sich in den letzten Jahren diesen 2000-Watt-Zielen verpflichtet und sie in ihre energiepolitischen Leitlinien integriert.

Label: Das Label "Energiestadt auf dem Weg in die 2000-Watt-Gesellschaft" würdigt auserlesene Energiestädte für ihre visionären, übergeordneten Zielsetzungen im Sinne der 2000-Watt-Philosophie. Das Zertifikat wird gemeinsam vom Bundesamt für Energie und vom Trägerverein Energiestadt ausgestellt. 

Pionier: Einzelne Städte und Gemeinden haben die Entwicklung der 2000-Watt-Idee durch ihr fortschrittliches und vorausdenkendes Handeln in den letzten Jahren massgeblich mitgeprägt und mitgestaltet.

Konzept: Im Rahmen des BFE Unterstützungs-programms „2000-Watt-Konzepte“ haben diese Energiestädte in einer ersten Phase nach Krite-rien der 2000-Watt-Gesellschaft Bilanzierungen und Konzepte erstellt, um sich auf ihren individuellen Absenkpfad begeben zu können. In einer zweiten Phase werden folgend auf der Grundlage der bestehenden lokalen Bilanz, der Potenzialanalyse und des definierten Absenkpfades standortgerechte Projekte ausgewählt und umgesetzt.
    </p></td> 
%endif
  </tr>
</table>
</%def>
