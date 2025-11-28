'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { Copy, Eye, Edit, Trash2, Loader } from 'lucide-react'
import Page from '@/components/page'
import Section from '@/components/section'
import { useAdmin } from '@/contexts/AdminContext'
import { useRecipes } from '@/hooks/useRecipes'
import { createRecipePost, deleteRecipePost } from '@/lib/github-api'

interface NewRecipeForm {
	name: string
	slug: string
	description: string
	servings: number
	cookTime: number
	prepTime: number
	difficulty: 'Easy' | 'Medium' | 'Hard'
	image: string
	mealType: string
	protein: string
	country: string
	ingredients: string
	instructions: string
	tastes: string
	ingredients_tags: string
}

export const DashboardContent = () => {
	const router = useRouter()
	const { isLoggedIn, logout, gitHubOwner, gitHubRepo, gitHubToken } = useAdmin()
	const { recipes, refetchRecipes } = useRecipes()
	const [activeTab, setActiveTab] = useState<'recipes' | 'create'>('recipes')
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState('')
	const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
	const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

	useEffect(() => {
		// Redirect if not logged in
		if (!isLoggedIn) {
			router.push('/login')
		}
	}, [isLoggedIn, router])

	const [formData, setFormData] = useState<NewRecipeForm>({
		name: '',
		slug: '',
		description: '',
		servings: 2,
		cookTime: 30,
		prepTime: 15,
		difficulty: 'Easy',
		image: '',
		mealType: 'Lunch',
		protein: 'None',
		country: '',
		ingredients: '',
		instructions: '',
		tastes: '',
		ingredients_tags: '',
	})

	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target

		setFormData((prev) => {
			const updated = { ...prev, [name]: value }

			// Auto-generate slug from name
			if (name === 'name') {
				updated.slug = generateSlug(value)
			}

			return updated
		})
	}

	const handleCreateRecipe = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setMessage('')

		try {
			// Validate required fields
			if (!formData.name || !formData.slug || !formData.country || !formData.ingredients || !formData.instructions) {
				setMessage('Please fill in all required fields')
				setMessageType('error')
				setLoading(false)
				return
			}

			// Create recipe object
			const newRecipe = {
				name: formData.name,
				slug: formData.slug,
				description: formData.description,
				servings: formData.servings,
				cookTime: formData.cookTime,
				prepTime: formData.prepTime,
				totalTime: formData.cookTime + formData.prepTime,
				difficulty: formData.difficulty,
				image: formData.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=60',
				tags: {
					meal: formData.mealType,
					ingredient: formData.ingredients_tags
						.split(',')
						.map((i) => i.trim())
						.filter((i) => i),
					meat: formData.protein,
					sideDish: false,
					taste: formData.tastes
						.split(',')
						.map((t) => t.trim())
						.filter((t) => t),
					country: formData.country,
				},
				ingredients: formData.ingredients
					.split('\n')
					.map((i) => i.trim())
					.filter((i) => i),
				instructions: formData.instructions
					.split('\n')
					.map((i) => i.trim())
					.filter((i) => i),
			}

			// Push to GitHub
			if (gitHubOwner && gitHubRepo && gitHubToken) {
				try {
					await createRecipePost(
						{
							name: newRecipe.name,
							slug: newRecipe.slug,
							description: newRecipe.description,
							servings: newRecipe.servings,
							cookTime: newRecipe.cookTime,
							prepTime: newRecipe.prepTime,
							difficulty: newRecipe.difficulty,
							image: newRecipe.image,
							mealType: newRecipe.tags.meal,
							protein: newRecipe.tags.meat,
							country: newRecipe.tags.country,
							ingredients: newRecipe.ingredients,
							instructions: newRecipe.instructions,
							tastes: newRecipe.tags.taste,
							ingredients_tags: newRecipe.tags.ingredient,
						},
						gitHubOwner,
						gitHubRepo,
						gitHubToken
					)
					
					// Refetch recipes to show the new one immediately
					await refetchRecipes()
					
					setMessage(`✅ Recipe "${newRecipe.name}" created and committed to GitHub!`)
					setMessageType('success')
				} catch (githubError) {
					setMessage(
						`⚠️ Recipe created locally but GitHub commit failed: ${githubError instanceof Error ? githubError.message : 'Unknown error'}`
					)
					setMessageType('error')
				}
			} else {
				setMessage('⚠️ GitHub credentials not configured. Recipe saved locally only.')
				setMessageType('error')
			}

			// Reset form
			setFormData({
				name: '',
				slug: '',
				description: '',
				servings: 2,
				cookTime: 30,
				prepTime: 15,
				difficulty: 'Easy',
				image: '',
				mealType: 'Lunch',
				protein: 'None',
				country: '',
				ingredients: '',
				instructions: '',
				tastes: '',
				ingredients_tags: '',
			})
		} catch (error) {
			setMessage('Error creating recipe: ' + (error instanceof Error ? error.message : 'Unknown error'))
			setMessageType('error')
		}

		setLoading(false)
	}

	const handleDeleteRecipe = async (slug: string) => {
		if (!confirm(`Are you sure you want to delete this recipe? This action cannot be undone.`)) {
			return
		}

		setDeletingSlug(slug)
		setMessage('')

		try {
			if (gitHubOwner && gitHubRepo && gitHubToken) {
				await deleteRecipePost(slug, gitHubOwner, gitHubRepo, gitHubToken)
				setMessage(`✅ Recipe deleted from GitHub`)
				setMessageType('success')
			} else {
				setMessage('⚠️ GitHub credentials not configured. Cannot delete recipe.')
				setMessageType('error')
			}
		} catch (error) {
			setMessage('Error deleting recipe: ' + (error instanceof Error ? error.message : 'Unknown error'))
			setMessageType('error')
		} finally {
			setDeletingSlug(null)
		}
	}

	const copyRecipeLink = (slug: string) => {
		const link = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/recipe/${slug}`
		navigator.clipboard.writeText(link)
		setMessage('📋 Recipe link copied to clipboard!')
		setMessageType('success')
		setTimeout(() => setMessage(''), 3000)
	}

	return (
		<Page>
			<Section>
				{/* Header with Gradient Background */}
				<div className='mb-10 pb-8 border-b-2 border-orange-200 dark:border-orange-900'>
					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2'>
								Recipe Admin
							</h1>
							<p className='text-zinc-600 dark:text-zinc-400 font-medium'>Manage your recipe posts and content</p>
						</div>
						<button
							onClick={() => {
								logout()
								router.push('/')
							}}
							className='px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
						>
							Logout
						</button>
					</div>
				</div>

				{/* Tabs - Modern Design */}
				<div className='flex gap-1 mb-8 bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl w-fit'>
					<button
						onClick={() => setActiveTab('recipes')}
						className={`px-6 py-3 font-bold rounded-lg transition-all ${
							activeTab === 'recipes'
								? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
								: 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
						}`}
					>
						📚 All Recipes ({recipes.length})
					</button>
					<button
						onClick={() => setActiveTab('create')}
						className={`px-6 py-3 font-bold rounded-lg transition-all ${
							activeTab === 'create'
								? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
								: 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
						}`}
					>
						✨ Create Recipe
					</button>
				</div>

				<div className='mb-8'>

				{/* Recipes List Tab */}
				{activeTab === 'recipes' && (
					<div>
						<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-6'>Recipes</h2>

						{message && (
							<div
								className={`p-4 rounded-lg mb-6 ${
									messageType === 'success'
										? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
										: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
								}`}
							>
								{message}
							</div>
						)}

						{recipes.length > 0 ? (
							<div className='overflow-x-auto rounded-lg border border-zinc-300 dark:border-zinc-700'>
								<table className='w-full'>
									<thead className='bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-700'>
									<tr className='bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b-2 border-orange-200 dark:border-orange-900'>
										<th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300'>Image</th>
										<th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300'>Title</th>
										<th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300'>Slug</th>
										<th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300'>Created</th>
										<th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300'>Actions</th>
									</tr>
									</thead>
									<tbody>
										{recipes.map((recipe, idx) => (
											<tr
												key={recipe.slug}
												className='border-b border-zinc-200 dark:border-zinc-700 hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-all'
											>
												{/* Image */}
							<td className='px-6 py-4'>
								<div className='h-16 w-16 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 relative'>
									<Image
										src={recipe.image}
										alt={recipe.name}
										fill
										className='object-cover'
									/>
								</div>
							</td>												{/* Title */}
												<td className='px-6 py-4'>
													<div className='font-semibold text-zinc-900 dark:text-white'>{recipe.name}</div>
													<div className='text-sm text-zinc-600 dark:text-zinc-400'>{recipe.description}</div>
												</td>

												{/* Slug */}
												<td className='px-6 py-4'>
													<code className='text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded text-zinc-900 dark:text-white'>
														/{recipe.slug}
													</code>
												</td>

												{/* Created Date */}
												<td className='px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400'>
													{new Date().toLocaleDateString()}
												</td>

												{/* Actions */}
												<td className='px-6 py-4'>
													<div className='flex gap-3'>
														{/* Copy Link */}
														<button
															onClick={() => copyRecipeLink(recipe.slug)}
															title='Copy recipe link'
															className='p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors'
														>
															<Copy className='w-5 h-5' />
														</button>

														{/* Open/View */}
														<a
															href={`/recipe/${recipe.slug}`}
															target='_blank'
															rel='noopener noreferrer'
															title='Open recipe in new tab'
															className='p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors'
														>
															<Eye className='w-5 h-5' />
														</a>

														{/* Edit */}
														<button
															onClick={() => {
																// Pre-fill form with recipe data
																setFormData({
																	name: recipe.name,
																	slug: recipe.slug,
																	description: recipe.description,
																	servings: recipe.servings,
																	cookTime: recipe.cookTime,
																	prepTime: recipe.prepTime,
																	difficulty: recipe.difficulty as 'Easy' | 'Medium' | 'Hard',
																	image: recipe.image,
																	mealType: recipe.tags.meal,
																	protein: recipe.tags.meat,
																	country: recipe.tags.country,
																	ingredients: recipe.ingredients.join('\n'),
																	instructions: recipe.instructions.join('\n'),
																	tastes: recipe.tags.taste.join(', '),
																	ingredients_tags: recipe.tags.ingredient.join(', '),
																})
																setActiveTab('create')
															}}
															title='Edit recipe'
															className='p-2 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors'
														>
															<Edit className='w-5 h-5' />
														</button>

														{/* Delete */}
														<button
															onClick={() => handleDeleteRecipe(recipe.slug)}
															disabled={deletingSlug === recipe.slug}
															title='Delete recipe'
															className='p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
														>
															{deletingSlug === recipe.slug ? (
																<Loader className='w-5 h-5 animate-spin' />
															) : (
																<Trash2 className='w-5 h-5' />
															)}
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className='p-8 text-center bg-zinc-50 dark:bg-zinc-800 rounded-lg'>
								<p className='text-zinc-600 dark:text-zinc-400'>No recipes yet. Create one to get started!</p>
							</div>
						)}
					</div>
				)}					{/* Create Recipe Tab */}
					{activeTab === 'create' && (
						<div>
							<h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-6'>Create New Recipe</h2>

							{message && (
								<div
									className={`p-4 rounded-lg mb-6 ${
										messageType === 'success'
											? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
											: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
									}`}
								>
									{message}
								</div>
							)}

							<form onSubmit={handleCreateRecipe} className='space-y-6'>
								{/* Basic Info */}
								<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg space-y-4'>
									<h3 className='font-semibold text-zinc-900 dark:text-white'>Basic Information</h3>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Recipe Name *
										</label>
										<input
											type='text'
											name='name'
											value={formData.name}
											onChange={handleInputChange}
											placeholder='e.g., Thai Green Curry'
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
											required
										/>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											URL Slug (auto-generated)
										</label>
										<input
											type='text'
											name='slug'
											value={formData.slug}
											readOnly
											className='w-full px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-600 cursor-not-allowed'
										/>
										<p className='text-xs text-zinc-500 dark:text-zinc-400 mt-1'>Auto-generated from recipe name</p>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Description
										</label>
										<textarea
											name='description'
											value={formData.description}
											onChange={handleInputChange}
											placeholder='Brief description of the recipe'
											rows={3}
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
										/>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Image URL
										</label>
										<input
											type='url'
											name='image'
											value={formData.image}
											onChange={handleInputChange}
											placeholder='https://...'
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
										/>
									</div>
								</div>

								{/* Recipe Details */}
								<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg space-y-4'>
									<h3 className='font-semibold text-zinc-900 dark:text-white'>Recipe Details</h3>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
												Servings
											</label>
											<input
												type='number'
												name='servings'
												value={formData.servings}
												onChange={handleInputChange}
												min='1'
												className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
											/>
										</div>

										<div>
											<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
												Prep Time (min)
											</label>
											<input
												type='number'
												name='prepTime'
												value={formData.prepTime}
												onChange={handleInputChange}
												min='0'
												className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
											/>
										</div>

										<div>
											<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
												Cook Time (min)
											</label>
											<input
												type='number'
												name='cookTime'
												value={formData.cookTime}
												onChange={handleInputChange}
												min='0'
												className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
											/>
										</div>

										<div>
											<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
												Difficulty
											</label>
											<select
												name='difficulty'
												value={formData.difficulty}
												onChange={handleInputChange}
												className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
											>
												<option>Easy</option>
												<option>Medium</option>
												<option>Hard</option>
											</select>
										</div>
									</div>
								</div>

								{/* Tags & Categories */}
								<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg space-y-4'>
									<h3 className='font-semibold text-zinc-900 dark:text-white'>Tags & Categories</h3>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Meal Type *
										</label>
										<select
											name='mealType'
											value={formData.mealType}
											onChange={handleInputChange}
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
										>
											<option>Breakfast</option>
											<option>Lunch</option>
											<option>Dinner</option>
											<option>Snack</option>
											<option>Appetizer</option>
											<option>Side Dish</option>
											<option>Dessert</option>
										</select>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Protein/Meat
										</label>
										<select
											name='protein'
											value={formData.protein}
											onChange={handleInputChange}
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
										>
											<option>None</option>
											<option>Chicken</option>
											<option>Beef</option>
											<option>Pork</option>
											<option>Shrimp</option>
											<option>Fish</option>
											<option>Tofu</option>
										</select>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Country/Cuisine *
										</label>
										<input
											type='text'
											name='country'
											value={formData.country}
											onChange={handleInputChange}
											placeholder='e.g., Thailand, Japan, Mexico'
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
											required
										/>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Key Ingredients (comma-separated)
										</label>
										<input
											type='text'
											name='ingredients_tags'
											value={formData.ingredients_tags}
											onChange={handleInputChange}
											placeholder='e.g., Chicken, Garlic, Ginger'
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
										/>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Taste Profile (comma-separated)
										</label>
										<input
											type='text'
											name='tastes'
											value={formData.tastes}
											onChange={handleInputChange}
											placeholder='e.g., Spicy, Sweet, Sour'
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500'
										/>
									</div>
								</div>

								{/* Recipe Content */}
								<div className='bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg space-y-4'>
									<h3 className='font-semibold text-zinc-900 dark:text-white'>Recipe Content</h3>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Ingredients (one per line) *
										</label>
										<textarea
											name='ingredients'
											value={formData.ingredients}
											onChange={handleInputChange}
											placeholder='1 kg chicken, cut into pieces&#10;4 tbsp soy sauce&#10;2 tbsp oil'
											rows={5}
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500 font-mono text-sm'
											required
										/>
									</div>

									<div>
										<label className='block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2'>
											Instructions (one per line) *
										</label>
										<textarea
											name='instructions'
											value={formData.instructions}
											onChange={handleInputChange}
											placeholder='Heat oil in a pan&#10;Add chicken and brown on all sides&#10;Add remaining ingredients&#10;Simmer for 30 minutes'
											rows={5}
											className='w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:border-orange-500 font-mono text-sm'
											required
										/>
									</div>
								</div>

								{/* Submit Button */}
								<button
									type='submit'
									disabled={loading}
									className='w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors'
								>
									{loading ? 'Creating Recipe...' : 'Create Recipe'}
								</button>
							</form>

							<div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-lg text-sm'>
								<p className='font-semibold mb-2'>🚀 GitHub Integration:</p>
								<p>When you create a recipe, it will be automatically committed to your GitHub repository ({gitHubOwner}/{gitHubRepo}). Each recipe is stored as a markdown file in the <code className='bg-blue-100 dark:bg-blue-800 px-1 rounded'>app/recipes/</code> folder.</p>
							</div>
						</div>
					)}
				</div>

				{/* Back to Home */}
				<div className='mt-8 text-center'>
					<Link href='/' className='text-orange-500 hover:text-orange-600 font-semibold'>
						← Back to Home
					</Link>
				</div>
			</Section>
		</Page>
	)
}
