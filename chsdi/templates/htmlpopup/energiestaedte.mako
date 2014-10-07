<%inherit file="base.mako"/> 

<%def name="table_body(c, lang)">
<tr>
  <td class="cell-left">${_('gemeinde_stadt')}</td>
  <td>${c['attributes']['name'] or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('punktezahl')}</td>
  <td>${c['attributes']['punktezahl'] or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('einwohnerzahl')}</td>
  <td>${int(c['attributes']['einwohner']) or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('energiestadtseit')}</td> 
  <td>${c['attributes']['energiestadtseit'] or '-'}</td>
</tr> 
</%def>
<%def name="extended_info(c, lang)">
<table class="table-with-border kernkraftwerke-extended" cellpadding="5">
  <tr>
    <th class="cell-meta">
      ${_('gemeinde_stadt')}
    </th>
    <td>
      ${c['attributes']['name']}
    </td>
  </tr>
  <tr>
    <th class="cell-meta">
      ${_('beteiligtegemeinden')}
    </th>
    <td>
      ${c['attributes']['beteiligtegemeinde'] or '-'}
    </td>
  </tr>
  <tr>
    <th class="cell-meta" >
      ${_('anzahlaudits')}
    </th>
    <td class="cell-meta">
      ${c['attributes']['anzahlaudits'] or '-'}
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
    <th class="cell-meta">
      ${_('energiestadtweb')}
    </th>
  % if c['attributes']['linkenergiestadtweb'] is None:
    <td class="cell-meta"> - </td>
  % else:
    <td class="cell-meta">
      <a target="_blank" href="${c['attributes']['linkenergiestadtweb']}">${_('link')}</a>
    </td>
  % endif
  </tr>
  <tr>
    <th class="cell-meta" colspan="2">
      ${_('kurzerklaerung')}
    </th>
  </tr>
  <tr>
  % if lang=='fr' :
    <td class="cell-meta" colspan="2"><p align="justify">
Le label «Cité de l’énergie» atteste les perfor-mances des communes qui pratiquent et mettent en œuvre une politique énergétique exemplaire en matière de développement durable. Les Cités de l’énergie promeuvent les énergies renouvelables et une mobilité respectueuse de l’environnement et elles favorisent l’utilisation efficace des ressources. Pour obtenir ce label, une commune doit avoir décidé ou concrétisé au minimum 50% de la marge de manœuvre dont elle dispose en matière de politique énergétique (marge de manœuvre calculée sur la base du catalogue d’exigences correspondant). La plus haute distinction est le «European Energy Award®GOLD». Elle est octroyée aux Cités de l’énergie qui ont mis en œuvre au moins 75% des mesures du catalogue élaboré lors de la procédure de certification. Le GOLD Award récompense les Cités de l’énergie pour leur engagement en faveur d’un avenir énergétique durable. Il se fonde sur divers aspects de la politique énergétique communale: planification du développement et aménagement du territoire, bâtiments et installations communales, approvisionnement et gestion des déchets, mobilité, organisation interne, communication et coopération.
    </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.citedelenergie.ch/fr/">Cités de l'énergie</a>
    </td>
  % elif lang=='it' :
    <td class="cell-meta" colspan="2"><p align="justify">
Il label «Città dell’energia» è un riconoscimento per i Comuni che adottano e danno esempio di una politica energetica comunale sostenibile. Le Città dell’energia promuovono le energie rinnovabili insieme a una mobilità sostenibile e utilizzano in modo efficiente le risorse. Per ottenere il label «Città dell’energia», un Comune deve avere realizzato o pianificato almeno il 50 per cento delle misure di politica energetica che rientrano nel suo margine di manovra. La valutazione viene effettuata sulla base del catalogo di provvedimenti standardizzato specifico per il label. Il più alto riconoscimento è l'«European Energy Award®GOLD» che viene assegnato a quei Comuni che hanno attuato almeno il 75 per cento dei provvedimenti del catalogo allestito durante la procedura di certificazione. Il GOLD-Award premia l'impegno delle Città dell'energia a favore di un futuro energetico sostenibile. Il label si basa sulla valutazione della politica energetica comunale in materia di pianificazione di sviluppo e ordinamento del territorio, degli edifici e degli impianti comunali, dell'approvvigionamento e dello smaltimento, della mobilità, dell'organizzazione interna, nonché della comunicazione e della cooperazione. 
    </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.cittadellenergia.ch/it/">Città dell’energia</a>
    </td>
  % elif lang=='en' :
    <td class="cell-meta" colspan="2"><p align="justify">
The Energy City label is an instrument that is applied to certify municipalities that develop and implement a sustainable energy policy. Municipalities that have been awarded the Energy City label promote renewable energy and ecological mobility, and focus on the efficient use of resources. In order to qualify for the label, a municipality must have realised or adopted at least 50 percent of its room for action in the area of energy policy. Here the calculation is based on the Energy Cities catalogue. The European Energy Award®GOLD is the highest level of certification. This label is awarded to municipalities that have implemented at least 75 percent of the measures listed in the catalogue at the time of certification. Municipalities that qualify for this award demonstrate the highest level of commitment towards a sustainable energy future. The label is based on an assessment of municipal energy policy in the areas of development and spatial planning, municipal buildings and installations, supply and disposal, mobility, internal organisation, commu-nication and cooperation. 
     </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.energiestadt.ch/de/">Energy cities</a>
    </td>
  % else :
    <td class="cell-meta" colspan="2"><p align="justify"> 
Das Label Energiestadt ist ein Leistungsausweis für Gemeinden, die eine nachhaltige kommunale Energiepolitik vorleben und umsetzen. Energiestädte fördern erneuerbare Energien, umweltverträgliche Mobilität und setzen auf eine effiziente Nutzung der Ressourcen. Um das Label Energiestadt zu erreichen, muss eine Gemeinde mindestens 50% ihres energiepolitischen Handlungsspielraums, ermittelt anhand des Energiestadt-Katalogs, realisiert oder beschlossen haben. Die höchste Auszeichnung ist der «European Energy Award®GOLD». Diese Ehrung erhalten Energiestädte, die 75 Prozent oder mehr der Massnah-men des beim Zertifizierungsverfahren erstellten Katalogs umgesetzt haben. Mit dem GOLD-Award krönen Energiestädte ihr Engagement für eine nachhaltige Energiezukunft. Das Label beruht auf der Beurteilung der kommunalen Energiepolitik in Entwicklungsplanung und Raumordnung, kommunaler Gebäude und Anlagen, der Versorgung und Entsorgung, der Mobilität, der internen Organisation sowie von Kommunikation und Kooperation.
    </p></td>
    </tr>
    <th class="cell-meta">
      ${_('link')}
    </th>
    <td class="cell-meta">
      <a target="_blank" href="http://www.energiestadt.ch/de/">Energiestädte</a>
    </td>
%endif
  </tr>
<tr><img class="image" src="//dav0.bgdi.admin.ch/bfe_pub/images_energiestadt/${c['attributes']['bfsnr']}.png" alt=""/></tr>
</table>
</%def>
