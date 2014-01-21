# -*- coding: utf-8 -*-

from Acquisition import aq_base, aq_inner
from plone.app.search.browser import Search as PloneSearch
from plone.contentrules import PloneMessageFactory as _
from plone.memoize import forever
from Products.CMFCore.utils import getToolByName
from urllib import urlencode
from zope.component import queryUtility
from zope.schema.interfaces import IVocabularyFactory


class Search(PloneSearch):
    """Customize NITF view
    """

    def skos(self, item):
        ''' Retorna lista de itens selecionados neste conteudo
        '''
        ps = self.context.restrictedTraverse('@@plone_portal_state')
        self.nav_root_url = ps.navigation_root().absolute_url()

        context = aq_base(aq_inner(item))
        uris = []
        if hasattr(context, 'skos'):
            uris = context.skos or []
        name = 'brasil.gov.vcge'
        util = queryUtility(IVocabularyFactory, name)
        vcge = util(context)
        skos = []
        for uri in uris:
            title = vcge.by_token[uri].title
            params = urlencode({'skos:list': uri})
            skos.append({'id': uri,
                         'title': title,
                         'url': '%s/@@busca?%s' % (self.nav_root_url,
                                                   params)})
        return skos

    @forever.memoize
    def type_name(self, item):
        portal_types = getToolByName(self.context, "portal_types")
        name = portal_types.getTypeInfo(item).Title()
        if (name == 'Folder'):
            return 'Pasta/Álbum'
        return _(name)

    def rel(self):
        '''Formata rel a ser utilizado no href de cada termo
        '''
        return u'dc:subject foaf:primaryTopic'
