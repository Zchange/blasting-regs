export type NodeLevel = 'chapter' | 'section' | 'appendix'

export interface TocNode {
  id: string
  number: string
  title: string
  level: NodeLevel
  parentId: string | null
  tags: string[]
  aliases: string[]
  relatedIds: string[]
  amendmentFlag?: boolean
  amendmentNote?: string
}

export interface Shortcut {
  id: string
  title: string
  subtitle: string
  targetIds: string[]
}

export interface Scenario {
  id: string
  title: string
  brief: string
  generalIds: string[]
  specialIds: string[]
}

export interface RelatedDoc {
  id: string
  number: string
  title: string
  kind: string
  status: string
  note: string
  officialUrl: string
  aliases?: string[]
}

export interface StandardMeta {
  number: string
  title: string
  titleEn: string
  kind: string
  status: string
  issued: string
  implemented: string
  issuerAtPublication: string
  competentDepartment: string
  replaces: string[]
  lastReview: string
  lastReviewConclusion: string
  pagesNote: string
  amendment: {
    number: string
    title: string
    officialRemark: string
    dateNote: string
    affectedSectionId: string
    scopeNote: string
  }
  revisionPlan: {
    number: string
    title: string
    issuedOn: string
    period: string
    status: string
    checkedOn: string
    note: string
  }
  officialUrls: {
    openstd: string
    stdPlatform: string
    revisionPlan: string
    spc: string
  }
}

export interface Catalog {
  standard: StandardMeta
  nodes: TocNode[]
  shortcuts: Shortcut[]
  scenarios: Scenario[]
  queryAliases: Record<string, string>
  relatedDocs: RelatedDoc[]
  disclaimer: string
}
