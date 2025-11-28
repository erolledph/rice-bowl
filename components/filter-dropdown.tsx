import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'

interface FilterDropdownProps {
	title: string
	options: string[]
	selectedOptions: string[]
	onSelectionChange: (selected: string[]) => void
	icon?: React.ReactNode
	placeholder?: string
	multi?: boolean
}

const FilterDropdown = ({
	title,
	options,
	selectedOptions,
	onSelectionChange,
	icon = <Search className='w-4 h-4' />,
	placeholder = 'Select...',
	multi = true,
}: FilterDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleOptionClick = (option: string) => {
		if (multi) {
			const updated = selectedOptions.includes(option)
				? selectedOptions.filter((item) => item !== option)
				: [...selectedOptions, option]
			onSelectionChange(updated)
		} else {
			onSelectionChange(selectedOptions.includes(option) ? [] : [option])
		}
	}

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation()
		onSelectionChange([])
	}

	const displayText =
		selectedOptions.length > 0
			? selectedOptions.length === 1
				? selectedOptions[0]
				: `${selectedOptions.length} selected`
			: placeholder

	return (
		<div ref={dropdownRef} className='relative'>
		<button
			onClick={() => setIsOpen(!isOpen)}
			className='w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white text-left flex items-center justify-between border border-zinc-300 dark:border-zinc-600 hover:border-orange-400 dark:hover:border-orange-500 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 transition-colors'
		>
			<span className='flex items-center gap-2'>
				<span className='flex items-center justify-center w-4 h-4'>{icon}</span>
				<span className='text-sm font-medium truncate'>{title}:</span>
				<span className='truncate text-orange-600 dark:text-orange-400 font-semibold'>
					{displayText}
				</span>
			</span>
			<ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
		</button>			{isOpen && (
				<div className='absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-700 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-600 max-h-64 overflow-y-auto'>
					<div className='p-3 border-b border-zinc-200 dark:border-zinc-600'>
						<input
							type='text'
							placeholder='Search options...'
							className='w-full px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-600 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm'
							onClick={(e) => e.stopPropagation()}
						/>
					</div>
					<div className='p-2 space-y-1'>
						{options.map((option) => (
							<label
								key={option}
								className='flex items-center gap-3 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-600 rounded cursor-pointer transition-colors'
								onClick={() => handleOptionClick(option)}
							>
								<input
									type={multi ? 'checkbox' : 'radio'}
									checked={selectedOptions.includes(option)}
									onChange={() => {}}
									className='w-4 h-4 cursor-pointer'
								/>
								<span className='text-sm text-zinc-900 dark:text-white'>{option}</span>
							</label>
						))}
					</div>
					{selectedOptions.length > 0 && (
						<div className='p-2 border-t border-zinc-200 dark:border-zinc-600 sticky bottom-0 bg-white dark:bg-zinc-700'>
							<button
								onClick={handleClear}
								className='w-full px-3 py-2 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors'
							>
								Clear Selection
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default FilterDropdown
