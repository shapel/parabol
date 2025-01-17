import React, {Suspense} from 'react'
import useQueryLoaderNow from '../hooks/useQueryLoaderNow'
import {BBox} from '../types/animations'
import suggestMentionableUsersQuery, {
  SuggestMentionableUsersQuery
} from '../__generated__/SuggestMentionableUsersQuery.graphql'
import SuggestMentionableUsers from './SuggestMentionableUsers'
import {DraftSuggestion} from './TaskEditor/useSuggestions'

interface Props {
  active: number
  handleSelect: (idx: number) => (e: React.MouseEvent) => void
  suggestions: DraftSuggestion[]
  setSuggestions: (suggestions: DraftSuggestion[]) => void
  originCoords: BBox
  triggerWord: string
  teamId: string
}

const SuggestMentionableUsersRoot = (props: Props) => {
  const {active, handleSelect, originCoords, setSuggestions, suggestions, triggerWord, teamId} =
    props
  const queryRef = useQueryLoaderNow<SuggestMentionableUsersQuery>(suggestMentionableUsersQuery, {
    teamId
  })
  return (
    <Suspense fallback={''}>
      {queryRef && (
        <SuggestMentionableUsers
          queryRef={queryRef}
          active={active}
          handleSelect={handleSelect}
          originCoords={originCoords}
          setSuggestions={setSuggestions}
          suggestions={suggestions}
          triggerWord={triggerWord}
        />
      )}
    </Suspense>
  )
}

export default SuggestMentionableUsersRoot
