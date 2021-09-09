import { render, screen } from '@testing-library/react'
import  Post  from '../../pages/posts/[slug]'
import { getSession, useSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'
import { useRouter } from 'next/router'
import { getStaticProps } from '../../pages'

const post = 
    {slug: 'my-next-post', title: 'My new Post', content: '<p>Post excerpt</p>', updatedAt: '10 de Abril'}


jest.mock('next-auth/client')
jest.mock('next/router')
jest.mock('../../services/prismic')

describe('Posts page', () => {
    it('should renders correctly', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])

        render(<Post post={post} />)

        expect(screen.getByText('My new Post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
        expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()
    })

    it('redirect user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null,
        } as any)

        const response = await getServerSideProps({
            params: { slug: 'my-new-post'}
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                })
            })
        )
    })

    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = mocked(useSession)
        const useRouterMocked = mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce([
            { activeSubscription: 'fake-active-subscription' },
            false
        ] as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMock,
        } as any)

        render(<Post post={post} />)

        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        {type: 'heading', text: 'My new post'}
                    ],
                    content: [
                        {type: 'paragraph', text: 'Post excerpt'}
                    ],
                },
                last_publication_date: '04-01-2021'
            })
        } as any)


        const response = await getStaticProps({ params: {slug: 'my-new-post'}})
        
        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My new post',
                        content: '<p>Post excerpt</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )

    })
})
