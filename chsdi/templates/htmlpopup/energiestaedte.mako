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
      ${c['attributes']['name'] or '-'}
    </td>
  </tr>
  <tr>
    <th class="cell-meta">
      ${_('punktezahl')}
    </th>
    <td>
      ${round(c['attributes']['punktezahl'],2) or '-'}
    </td>
  </tr>
  <tr>
    <th class="cell-meta">
      ${_('einwohnerzahl')}
    </th>
    <td>
      ${int(c['attributes']['einwohner']) or '-'}
    </td>
  </tr>
  <tr>
    <th class="cell-meta">
      ${_('energiestadtseit')}
    </th>
    <td>
      ${c['attributes']['energiestadtseit'] or '-'}
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
Le label «Cité de l’énergie» atteste les performances des communes qui pratiquent et mettent en œuvre une politique énergétique exemplaire en matière de développement durable. Les Cités de l’énergie promeuvent les énergies renouvelables et une mobilité respectueuse de l’environnement et elles favorisent l’utilisation efficace des ressources. Pour obtenir le label «Cité de l’énergie», une commune doit avoir décidé ou concrétisé au minimum 50% de la marge de manœuvre dont elle dispose en matière de politique énergétique (marge de manœuvre calculée sur la base du catalogue d’exigences correspondant). La plus haute distinction pour les cités de l’énergie est le «European Energy Award®GOLD». Cette distinction est octroyée aux Cités de l’énergie qui ont mis en œuvre au moins 75% des mesures du catalogue élaboré lors de la procédure de certification. Le GOLD Award récompense les Cités de l’énergie pour leur engagement en faveur d’un avenir énergétique durable. Il se fonde sur divers aspects de la politique énergétique communale: planification du développement et aménagement du territoire, bâtiments et installations communales, approvisionnement et gestion des déchets, mobilité, organisation interne, communication et coopération.
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
Il label Città dell’energia è un riconoscimento per i Comuni che adottano e vivono una politica energetica comunale sostenibile. Le città dell’energia promuovono le energie rinnovabili, una mobilità sostenibile e utilizzano in modo efficiente le risorse. Per ottenere il riconoscimento i Comuni devono avere realizzato o deciso formalmente il 50 % delle misure possibili nell’ambito del proprio margine di manovra politico, scelte sulla base del Catalogo Città dell’energia standardizzato. Il massimo riconoscimento per le città dell’energia è l’«European Energy Award®GOLD», rilasciato solo alle città che hanno attuato almeno il 75 % delle misure definite nel catalogo stilato nell’ambito della procedura di certificazione. Con il GOLD-Award le città dell’energia coronano il proprio impegno per un futuro energetico sostenibile. Il riconoscimento è basato sulla valutazione della politica energetica comunale nei settori della pianificazione dello sviluppo, dell’ordinamento territoriale, degli edifici e degli impianti comunali, dei sistemi di approvvigionamento e di smaltimento, della mobilità, dell’organizzazione interna nonché della comunicazione e della cooperazione.
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
The Energy City label is used for certifying municipalities that develop and implement a sustainable energy policy. Municipalities that have been awarded this label promote renewable energy and ecological mobility, and focus on the efficient use of resources. In order to qualify for the label, a municipality must have realised or adopted at least 50 percent of its scope for action in the area of energy policy. Here the calculation is based on the Energy Cities catalogue. The European Energy Award®GOLD is the highest level of certification. This label is awarded to municipalities that have implemented at least 75 percent of the measures listed in the catalogue at the time of certification. Municipalities that qualify for this award demonstrate the highest level of commitment towards a sustainable energy future. The label is based on an assessment of municipal energy policy in the areas of development and spatial planning, municipal buildings and installations, supply and disposal, mobility, internal organisation, communication and cooperation.
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
Das Label Energiestadt ist ein Leistungsausweis für Gemeinden, die eine nachhaltige kommunale Energiepolitik vorleben und umsetzen. Energiestädte fördern erneuerbare Energien, umweltverträgliche Mobilität und setzen auf eine effiziente Nutzung der Ressourcen. Um das Label Energiestadt zu erreichen, muss eine Gemeinde mindestens 50% ihres energiepolitischen Handlungsspielraums, ermittelt anhand des Energiestadt-Katalogs, realisiert oder beschlossen haben. Die höchste Auszeichnung ist der «European Energy Award®GOLD». Diese Ehrung erhalten Energiestädte, die 75 Prozent oder mehr der Massnahmen des beim Zertifizierungsverfahren erstellten Katalogs umgesetzt haben. Mit dem GOLD-Award krönen Energiestädte ihr Engagement für eine nachhaltige Energiezukunft. Das Label beruht auf der Beurteilung der kommunalen Energiepolitik in Entwicklungsplanung und Raumordnung, kommunaler Gebäude und Anlagen, der Versorgung und Entsorgung, der Mobilität, der internen Organisation sowie von Kommunikation und Kooperation.
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
