import { attach } from 'effector'
import * as api from '~/shared/api'

export const getCardDraftFx = attach({ effect: api.getCardDraftFx })
